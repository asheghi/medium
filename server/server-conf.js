const path = require('path');
const crypto = require('crypto');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '../.data');
const mediaDir = path.join(dataDir, 'media');
const uploadsDir = path.join(dataDir, 'uploads');
const jwtCookieField = 'auth.jwt';
const isProduction = process.env.NODE_ENV === 'production';
const configuredJwtSecret = process.env.JWT_SECRET;

if (isProduction && (!configuredJwtSecret || configuredJwtSecret === 'ChangeItToaSuperSecureSecret')) {
  throw new Error('JWT_SECRET must be configured with a strong value in production');
}

const jwtSecret = configuredJwtSecret || crypto.randomBytes(32).toString('hex');
const jwtExpiresIn = '12h';
const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  maxAge: 12 * 60 * 60 * 1000,
  path: '/',
};
module.exports = {
  dataDir,
  mediaDir,
  uploadsDir,
  jwtCookieField,
  jwtSecret,
  jwtExpiresIn,
  authCookieOptions,
};
