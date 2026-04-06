/**
 * Configuration du logger applicatif — Winston.
 *
 * Canaux : combined (fichier + console), security (fichier dédié).
 */
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'edificepro' },
  transports: [
    new transports.File({ filename: 'var/log/error.log', level: 'error' }),
    new transports.File({ filename: 'var/log/app.log' }),
  ],
});

// Canal dédié sécurité
const securityLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  defaultMeta: { channel: 'security' },
  transports: [
    new transports.File({ filename: 'var/log/security.log' }),
  ],
});

if (process.env.APP_ENV !== 'production' && process.env.APP_ENV !== 'test') {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  }));
}

module.exports = { logger, securityLogger };
