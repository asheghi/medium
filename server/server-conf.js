const path = require('path');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '../data');
const mediaDir = path.join(dataDir, 'media');
const uploadsDir = path.join(dataDir, 'uploads');

module.exports = {
  dataDir,
  mediaDir,
  uploadsDir,
};
