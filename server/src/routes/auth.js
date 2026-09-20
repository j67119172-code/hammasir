// server/src/routes/auth.js
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { asyncHandler, badRequest, conflict, unauthorized } from '../middleware/errors.js';
import { signAccessToken, signRefreshToken } from '../middleware/auth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimit.js';
import { createOtp, verifyOtp } from '../services/otp.js';
import { sendOtpSms } from '../services/sms.js';
import { logger } from '../config/logger.js';

export const authRouter = Router();

const phoneRegex = /^09\d{9}$/;
const usernameRegex = /^[A-Za-z][A-Za-z0-9_.]{3,19}$/;

const RequestOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'شماره موبایل نامعتبر است.'),
});

const SignupSchema = z.object({
  username: z.string().regex(usernameRegex, 'نام کاربری نامعتبر است.'),
  password: z.string().min(8).max(64)
    .refine(v => /[A-Za-z]/.test(v) && /[0-9]/.test(v),
      'رمز عبور باید حداقل یک حرف و یک عدد داشته باشد.'),
  phone: z.string().regex(phoneRegex, 'شماره موبایل نامعتبر است.'),
  code: z.string().regex(/^\d{6}$/, 'کد تأیید باید ۶ رقم باشد.'),
  name: z.string().min(5).max(60),
  gender: z.enum(['male', 'female']),
  age: z.number().int().min(18).max(80),
  sameGenderOnly: z.boolean().optional().default(false),
  sameCarClassOnly: z.boolean().optional().default(false),
});

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

authRouter.post(
  '/request-otp',
  otpLimiter,
  asyncHandler(async (req, res) => {
    const { phone } = RequestOtpSchema.parse(req.body);

    const { rowCount } = await query(
      `SELECT 1 FROM users WHERE phone = $1 LIMIT 1`, [phone]
    );
    if (rowCount > 0)
      throw conflict('PHONE_ALREADY_REGISTERED', 'این شماره قبلاً ثبت‌نام کرده است.');

    const { code } = await createOtp(phone, 'signup');
    await sendOtpSms(phone, code);
    logger.info({ phone }, 'OTP requested');
    res.json({ ok: true, ttlSeconds: env.otp.ttlSeconds });
  })
);

authRouter.post(
  '/signup',
  authLimiter,
  asyncHandler(async (req, res) => {
    const data = SignupSchema.parse(req.body);
    await verifyOtp(data.phone, data.code, 'signup');

    const { rows: existing } = await query(
      `SELECT username, phone FROM users WHERE username = $1 OR phone = $2 LIMIT 1`,
      [data.username, data.phone]
    );
    if (existing[0]) {
      if (existing[0].username === data.username)
        throw conflict('USERNAME_TAKEN', 'این نام کاربری قبلاً گرفته شده است.');
      if (existing[0].phone === data.phone)
        throw conflict('PHONE_TAKEN', 'این شماره قبلاً ثبت‌نام کرده است.');
    }

    const hash = await bcrypt.hash(data.password, 12);
    const { rows: created } = await query(
      `INSERT INTO users
        (username, password_hash, phone, phone_verified,
         name, gender, age, same_gender_only, same_car_class_only,
         review_status, review_message)
       VALUES ($1, $2, $3, TRUE, $4, $5, $6, $7, $8, 'approved', 'عضویت شما تأیید شده است.')
       RETURNING id, username`,
      [
        data.username, hash, data.phone,
        data.name, data.gender, data.age,
        data.sameGenderOnly, data.sameCarClassOnly,
      ]
    );

    const user = created[0];
    res.status(201).json({
      ok: true,
      user: { id: user.id, username: user.username },
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    });
  })
);

authRouter.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const data = LoginSchema.parse(req.body);
    const { rows } = await query(
      `SELECT id, username, password_hash FROM users WHERE username = $1 LIMIT 1`,
      [data.username]
    );
    const user = rows[0];
    if (!user) throw unauthorized('BAD_CREDENTIALS', 'نام کاربری یا رمز عبور صحیح نیست.');

    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) throw unauthorized('BAD_CREDENTIALS', 'نام کاربری یا رمز عبور صحیح نیست.');

    res.json({
      ok: true,
      user: { id: user.id, username: user.username },
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    });
  })
);

authRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) throw badRequest('NO_REFRESH', 'refreshToken ارائه نشده.');

    let payload;
    try {
      payload = jwt.verify(refreshToken, env.jwtSecret);
    } catch {
      throw unauthorized('BAD_REFRESH', 'refreshToken نامعتبر است.');
    }
    if (payload.kind !== 'refresh')
      throw unauthorized('WRONG_REFRESH', 'نوع توکن نامعتبر.');

    const { rows } = await query(
      `SELECT id, username FROM users WHERE id = $1 LIMIT 1`,
      [payload.sub]
    );
    const user = rows[0];
    if (!user) throw unauthorized('USER_GONE', 'کاربر یافت نشد.');

    res.json({
      ok: true,
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    });
  })
);
