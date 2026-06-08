const test = require('node:test');
const assert = require('node:assert/strict');
const { requireSameOrigin } = require('../../server/lib/origin.middleware');

function runMiddleware({ method = 'POST', origin }) {
  let statusCode;
  let body;
  let nextCalled = false;
  const headers = { host: 'blog.example.com', origin };
  const req = {
    method,
    protocol: 'https',
    get: (name) => headers[name.toLowerCase()],
  };
  const res = {
    status(status) {
      statusCode = status;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  requireSameOrigin(req, res, () => { nextCalled = true; });
  return { statusCode, body, nextCalled };
}

test('allows same-origin mutations', () => {
  assert.equal(runMiddleware({ origin: 'https://blog.example.com' }).nextCalled, true);
});

test('rejects cross-origin mutations', () => {
  const result = runMiddleware({ origin: 'https://attacker.example' });
  assert.equal(result.statusCode, 403);
  assert.equal(result.body.error.code, 'INVALID_ORIGIN');
});

test('allows requests without Origin for non-browser clients', () => {
  assert.equal(runMiddleware({}).nextCalled, true);
});
