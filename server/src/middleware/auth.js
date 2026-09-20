// server/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { unauthorized } from './errors.js';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), username: user.username },
    env.jwtSecret,
    { expiresIn: env.jwtAccessTtl }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: String(user.id), kind: 'refresh' },
    env.jwtSecret,
    { expiresIn: env.jwtRefreshTtl }
  );
}

function extractToken(req) {
  const h = req.headers.authorization || '';
  if (h.startsWith('Bearer ')) return h.slice(7).trim();
  return null;
}

export function requireAuth(req, _res, next) {
  const token = extractToken(req);
  if (!token) return next(unauthorized('NO_TOKEN', 'توکن احراز هویت ارائه نشده.'));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.kind === 'refresh') return next(unauthorized('WRONG_TOKEN', 'نوع توکن نامعتبر.'));
    req.user = { id: Number(payload.sub), username: payload.username };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return next(unauthorized('TOKEN_EXPIRED', 'توکن منقضی شده است.'));
    return next(unauthorized('BAD_TOKEN', 'توکن نامعتبر است.'));
  }
}
