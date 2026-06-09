const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword } = require('../../server/lib/password');

test('password hashes use versioned scrypt parameters and unique salts', async () => {
  const first = await hashPassword('correct horse battery staple');
  const second = await hashPassword('correct horse battery staple');

  assert.match(first, /^scrypt-v1\$16384\$8\$1\$/);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(first, 'correct horse battery staple'), true);
  assert.equal(await verifyPassword(first, 'wrong password'), false);
});

test('malformed password hashes are rejected', async () => {
  assert.equal(await verifyPassword('not-a-password-hash', 'password'), false);
});
