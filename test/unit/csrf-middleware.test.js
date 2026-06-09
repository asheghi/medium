const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createCsrfToken, requireCsrfToken, tokensMatch,
} = require('../../server/lib/csrf.middleware');
const { csrfCookieField } = require('../../server/server-conf');

test('CSRF tokens are random and compare only when identical', () => {
  const first = createCsrfToken();
  const second = createCsrfToken();

  assert.match(first, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first, second);
  assert.equal(tokensMatch(first, first), true);
  assert.equal(tokensMatch(first, second), false);
  assert.equal(tokensMatch(first, 'invalid'), false);
});

test('unsafe requests require matching cookie and header tokens', () => {
  const token = createCsrfToken();
  let statusCode;
  let body;
  let nextCalled = false;
  const req = {
    method: 'POST',
    cookies: { [csrfCookieField]: token },
    get: () => 'wrong-token',
  };
  const res = {
    status(status) { statusCode = status; return this; },
    json(value) { body = value; return this; },
  };

  requireCsrfToken(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, false);
  assert.equal(statusCode, 403);
  assert.equal(body.error.code, 'INVALID_CSRF_TOKEN');
});
