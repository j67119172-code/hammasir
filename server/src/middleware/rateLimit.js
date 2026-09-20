// server/src/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { tooMany } from './errors.js';

const handler = (_req, _res, next) => next(tooMany());

export const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const otpLimiter = rateLimit({
  windowMs: env.otp.rateWindowSec * 1000,
  max: env.otp.rateMaxPerPhone,
  keyGenerator: (req) => String(req.body?.phone || req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
