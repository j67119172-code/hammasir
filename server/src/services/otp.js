// server/src/services/otp.js
import crypto from 'node:crypto';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { badRequest, tooMany } from '../middleware/errors.js';

function hashCode(phone, code) {
  return crypto
    .createHmac('sha256', env.otp.hashPepper)
    .update(`${phone}:${code}`)
    .digest('hex');
}

function generateCode(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(crypto.randomInt(min, max + 1));
}

async function clearPrevious(phone) {
  await query(
    `UPDATE otp_requests SET used_at = now()
      WHERE phone = $1 AND used_at IS NULL`,
    [phone]
  );
}

export async function createOtp(phone, purpose = 'signup') {
  await clearPrevious(phone);
  const code = generateCode(6);
  const codeHash = hashCode(phone, code);
  const expiresAt = new Date(Date.now() + env.otp.ttlSeconds * 1000);

  await query(
    `INSERT INTO otp_requests (phone, code_hash, purpose, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [phone, codeHash, purpose, expiresAt]
  );
  return { code, expiresAt };
}

export async function verifyOtp(phone, code, purpose = 'signup') {
  const { rows } = await query(
    `SELECT id, code_hash, attempts, expires_at, used_at
       FROM otp_requests
      WHERE phone = $1 AND purpose = $2 AND used_at IS NULL
      ORDER BY id DESC LIMIT 1`,
    [phone, purpose]
  );
  const row = rows[0];
  if (!row) throw badRequest('OTP_NOT_FOUND', 'کد تأییدی برای این شماره ثبت نشده است.');
  if (new Date(row.expires_at) < new Date())
    throw badRequest('OTP_EXPIRED', 'کد تأیید منقضی شده است.');
  if (row.attempts >= env.otp.maxAttempts)
    throw tooMany('OTP_TOO_MANY_ATTEMPTS', 'تعداد تلاش‌های ناموفق بیش از حد مجاز.');

  const expected = hashCode(phone, code);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(row.code_hash, 'hex');
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    await query(`UPDATE otp_requests SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
    throw badRequest('OTP_INVALID', 'کد تأیید صحیح نیست.');
  }
  await query(`UPDATE otp_requests SET used_at = now() WHERE id = $1`, [row.id]);
  return true;
}
