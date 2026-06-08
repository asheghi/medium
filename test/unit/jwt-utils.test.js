const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = 'unit-test-secret-with-sufficient-length';

const { JwtUtils } = require('../../server/lib/jwt-utils');
const { jwtCookieField } = require('../../server/server-conf');

test('issued tokens include an expiry and verify for the same request fingerprint', () => {
  const sourceRequest = { ip: '127.0.0.1', headers: { 'user-agent': 'unit-test' } };
  const token = JwtUtils.generateTokenForRequest(sourceRequest, { id: 1, email: 'admin@example.com' });
  const payload = JwtUtils.verifyToken(token);
  const request = {
    ...sourceRequest,
    cookies: { [jwtCookieField]: token },
  };

  assert.equal(payload.id, 1);
  assert.ok(payload.exp > payload.iat);
  assert.equal(JwtUtils.verifyRequest(request), true);
  assert.equal(request.user.email, 'admin@example.com');
});

test('tampered tokens are rejected', () => {
  const token = JwtUtils.generateTokenForPayload({ id: 1 });
  assert.equal(JwtUtils.verifyToken(`${token}broken`), false);
});
