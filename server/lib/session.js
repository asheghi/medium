const { createHash, randomBytes } = require('crypto');

const SESSION_BYTES = 32;

function createSessionToken() {
  return randomBytes(SESSION_BYTES).toString('base64url');
}

function hashSessionToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function getSessionExpiry(lifetimeMs, now = new Date()) {
  return new Date(now.getTime() + lifetimeMs);
}

module.exports = { createSessionToken, getSessionExpiry, hashSessionToken };
