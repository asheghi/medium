const path = require('path');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '../.data');
const mediaDir = path.join(dataDir, 'media');
const uploadsDir = path.join(dataDir, 'uploads');
const isProduction = process.env.NODE_ENV === 'production';
const sessionCookieField = 'auth.session';
const sessionLifetimeMs = 12 * 60 * 60 * 1000;
const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  maxAge: sessionLifetimeMs,
  path: '/',
};
module.exports = {
  dataDir,
  mediaDir,
  uploadsDir,
  sessionCookieField,
  sessionLifetimeMs,
  authCookieOptions,
};
