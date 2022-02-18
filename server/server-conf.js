const path = require('path');
const { randomString } = require('./lib/utils');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '../.data');
const mediaDir = path.join(dataDir, 'media');
const uploadsDir = path.join(dataDir, 'uploads');
const jwtCookieField = 'auth.jwt';
const jwtSecret = process.env.JWT_SECRET || randomString(10);
module.exports = {
  dataDir,
  mediaDir,
  uploadsDir,
  jwtCookieField,
  jwtSecret,
};
