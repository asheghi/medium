const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createSessionToken, getSessionExpiry, hashSessionToken,
} = require('../../server/lib/session');

test('session tokens are opaque, random, and stored as deterministic hashes', () => {
  const first = createSessionToken();
  const second = createSessionToken();

  assert.notEqual(first, second);
  assert.match(first, /^[A-Za-z0-9_-]+$/);
  assert.equal(hashSessionToken(first), hashSessionToken(first));
  assert.notEqual(hashSessionToken(first), first);
  assert.notEqual(hashSessionToken(first), hashSessionToken(second));
});

test('session expiry is bounded from the supplied time', () => {
  const now = new Date('2026-06-09T10:00:00.000Z');
  assert.equal(getSessionExpiry(1000, now).toISOString(), '2026-06-09T10:00:01.000Z');
});
