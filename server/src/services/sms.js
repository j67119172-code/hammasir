// server/src/services/sms.js
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { query } from '../config/db.js';

export async function sendSms({ phone, text, purpose = 'generic', userId = null }) {
  if (env.sms.dryRun || !env.sms.apiKey) {
    logger.info({ phone, purpose, text }, 'SMS (dry-run)');
    await logSms({ userId, phone, text, purpose, status: 'dry-run', providerRef: null });
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.kavenegar.com/v1/' + env.sms.apiKey + '/sms/send.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        receptor: phone,
        message: text,
        sender: env.sms.sender,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.return?.status === 200) {
      const ref = data?.entries?.[0]?.messageid ? String(data.entries[0].messageid) : null;
      await logSms({ userId, phone, text, purpose, status: 'sent', providerRef: ref });
      return { ok: true, providerRef: ref };
    }
    throw new Error(data?.return?.message || 'SMS provider error');
  } catch (err) {
    logger.error({ err, phone, purpose }, 'SMS send failed');
    await logSms({
      userId, phone, text, purpose,
      status: 'failed', providerRef: null,
      error: String(err?.message || err),
    });
    return { ok: false, error: String(err?.message || err) };
  }
}

async function logSms({ userId, phone, text, purpose, status, providerRef, error }) {
  try {
    await query(
      `INSERT INTO sms_log (user_id, phone, text, purpose, status, provider_ref)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, phone, text, purpose, error ? `${status}:${error}` : status, providerRef]
    );
  } catch (e) {
    logger.error({ err: e }, 'SMS log insert failed');
  }
}

export async function sendOtpSms(phone, code) {
  const text = `کد تأیید هم‌مسیر: ${code}`;
  return sendSms({ phone, text, purpose: 'otp' });
      }
