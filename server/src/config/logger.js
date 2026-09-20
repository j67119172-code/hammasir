// server/src/config/logger.js
import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.logLevel,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.code',
      '*.password',
      '*.code',
      '*.apiKey',
    ],
    censor: '[REDACTED]',
  },
});
