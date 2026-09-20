// server/src/middleware/errors.js
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code, msg, details) => new AppError(400, code, msg, details);
export const unauthorized = (code = 'UNAUTHORIZED', msg = 'احراز هویت لازم است.') =>
  new AppError(401, code, msg);
export const forbidden = (code = 'FORBIDDEN', msg = 'دسترسی مجاز نیست.') =>
  new AppError(403, code, msg);
export const notFound = (code = 'NOT_FOUND', msg = 'یافت نشد.') =>
  new AppError(404, code, msg);
export const conflict = (code, msg) => new AppError(409, code, msg);
export const tooMany = (code = 'RATE_LIMIT', msg = 'تعداد درخواست‌ها بیش از حد مجاز.') =>
  new AppError(429, code, msg);

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';

  if (status >= 500) {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  }

  res.status(status).json({
    error: {
      code,
      message: err.message || 'خطای غیرمنتظره',
      ...(err.details ? { details: err.details } : {}),
      ...(env.isProd ? {} : { stack: err.stack }),
    },
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `مسیر ${req.method} ${req.path} وجود ندارد.` },
  });
}

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
