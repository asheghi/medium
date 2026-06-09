const {
  randomBytes, scrypt: scryptCallback, timingSafeEqual,
} = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(scryptCallback);
const VERSION = 'scrypt-v1';
const KEY_LENGTH = 64;
const PARAMETERS = { N: 16384, r: 8, p: 1 };

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH, PARAMETERS);
  return [
    VERSION,
    PARAMETERS.N,
    PARAMETERS.r,
    PARAMETERS.p,
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}

async function verifyPassword(storedHash, password) {
  if (typeof storedHash !== 'string') return false;
  const [version, n, r, p, saltValue, keyValue] = storedHash.split('$');
  if (version !== VERSION || !saltValue || !keyValue) return false;

  const salt = Buffer.from(saltValue, 'base64url');
  const expectedKey = Buffer.from(keyValue, 'base64url');
  if (expectedKey.length !== KEY_LENGTH) return false;

  try {
    const actualKey = await scrypt(password, salt, KEY_LENGTH, {
      N: Number(n), r: Number(r), p: Number(p),
    });
    return timingSafeEqual(expectedKey, actualKey);
  } catch (error) {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
