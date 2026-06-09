const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@127.0.0.1:5432/test';
process.env.MINIO_END_POINT_URL = process.env.MINIO_END_POINT_URL || '127.0.0.1';
process.env.MINIO_PORT = process.env.MINIO_PORT || '9000';
process.env.MINIO_ROOT_USER = process.env.MINIO_ROOT_USER || 'test-access-key';
process.env.MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD || 'test-secret-key';
process.env.MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'test-bucket';

const { createApp } = require('../../server/app');
const { AuthService } = require('../../server/api/auth/auth.service');

function parseSetCookies(response) {
  return response.headers.getSetCookie().map((value) => value.split(';', 1)[0]);
}

test('auth API enforces CSRF and handles login, expiry, and logout', async (t) => {
  const originals = { ...AuthService };
  let activeToken;
  let revokedToken;
  AuthService.login = async (email, password) => (
    email === 'admin@example.com' && password === 'correct-password'
      ? { id: '8e133d9e-5e77-43ba-9bc6-107f965d8868', email }
      : null
  );
  AuthService.createSession = async () => {
    activeToken = 'test-session-token';
    return activeToken;
  };
  AuthService.getSessionUser = async (token) => (
    token === activeToken
      ? { id: '8e133d9e-5e77-43ba-9bc6-107f965d8868', email: 'admin@example.com' }
      : null
  );
  AuthService.revokeSession = async (token) => { revokedToken = token; };

  const app = await createApp({ includeSsr: false });
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => {
    server.once('listening', resolve);
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    Object.assign(AuthService, originals);
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  const rejectedLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'correct-password' }),
  });
  assert.equal(rejectedLogin.status, 403);
  assert.equal((await rejectedLogin.json()).error.code, 'INVALID_CSRF_TOKEN');

  const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
  assert.equal(csrfResponse.status, 200);
  const { csrfToken } = await csrfResponse.json();
  const csrfCookie = parseSetCookies(csrfResponse).find((cookie) => cookie.startsWith('auth.csrf='));

  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: csrfCookie,
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify({ email: 'admin@example.com', password: 'correct-password' }),
  });
  assert.equal(loginResponse.status, 200);
  const sessionCookie = parseSetCookies(loginResponse).find((cookie) => cookie.startsWith('auth.session='));
  assert.equal(sessionCookie, `auth.session=${activeToken}`);

  const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: sessionCookie },
  });
  assert.equal(meResponse.status, 200);
  assert.equal((await meResponse.json()).email, 'admin@example.com');

  activeToken = undefined;
  const expiredResponse = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: sessionCookie },
  });
  assert.equal(expiredResponse.status, 401);

  activeToken = 'test-session-token';
  const rejectedLogout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { cookie: sessionCookie },
  });
  assert.equal(rejectedLogout.status, 403);

  const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: {
      cookie: `${sessionCookie}; ${csrfCookie}`,
      'x-csrf-token': csrfToken,
    },
  });
  assert.equal(logoutResponse.status, 204);
  assert.equal(revokedToken, activeToken);
});
