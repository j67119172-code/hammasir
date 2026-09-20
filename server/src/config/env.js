// server/src/config/env.js
import 'dotenv/config';

function required(key, fallback) {
  const v = process.env[key] ?? fallback;
  if (v === undefined || v === '') {
    throw new Error(`ENV: متغیر ${key} الزامی است ولی مقدار ندارد.`);
  }
  return v;
}

function bool(key, fallback = false) {
  const v = process.env[key];
  if (v === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

function int(key, fallback) {
  const v = process.env[key];
  if (v === undefined) return fallback;
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`ENV: ${key} باید عدد باشد.`);
  return n;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: int('PORT', 3000),
  logLevel: process.env.LOG_LEVEL || 'info',

  databaseUrl: required('DATABASE_URL'),
  pgSsl: bool('PGSSL', false),

  jwtSecret: required('JWT_SECRET'),
  jwtAccessTtl: process.env.JWT_ACCESS_TTL || '15m',
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL || '30d',

  otp: {
    ttlSeconds: int('OTP_TTL_SECONDS', 120),
    maxAttempts: int('OTP_MAX_ATTEMPTS', 5),
    rateWindowSec: int('OTP_RATE_WINDOW_SECONDS', 120),
    rateMaxPerPhone: int('OTP_RATE_MAX_PER_PHONE', 3),
    hashPepper: required('OTP_HASH_PEPPER'),
  },

  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean),

  sms: {
    provider: process.env.SMS_PROVIDER || 'kavenegar',
    apiKey: process.env.SMS_API_KEY || '',
    sender: process.env.SMS_SENDER || '',
    dryRun: bool('SMS_DRY_RUN', true),
  },

  payment: {
    zarinpalMerchantId: process.env.ZARINPAL_MERCHANT_ID || '',
    zarinpalSandbox: bool('ZARINPAL_SANDBOX', true),
    callbackUrl: process.env.PAYMENT_CALLBACK_URL || '',
  },

  fees: {
    base: int('FEE_AMOUNT', 50000),
    repeatProposal: int('REPEAT_PROPOSAL_FEE', 15000),
  },
};
