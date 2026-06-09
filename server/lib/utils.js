const debug = require('debug');
const crypto = require('crypto');

module.exports.randomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (byte) => characters[byte % characters.length]).join('');
};

module.exports.getServerDebug = (name, type) => {
  let namespace = `app:${name}`;
  if (type) {
    namespace += `:${type}`;
  }
  return debug(namespace);
};
