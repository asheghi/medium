const { randomBytes, timingSafeEqual } = require('crypto');
const {
  csrfCookieField, csrfCookieOptions,
} = require('../server-conf');

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;

function createCsrfToken() {
  return randomBytes(32).toString('base64url');
}

function tokensMatch(cookieToken, headerToken) {
  if (typeof cookieToken !== 'string' || typeof headerToken !== 'string') return false;
  if (!tokenPattern.test(cookieToken) || !tokenPattern.test(headerToken)) return false;
  return timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken));
}

function issueCsrfToken(req, res) {
  const token = createCsrfToken();
  res.cookie(csrfCookieField, token, csrfCookieOptions);
  return res.json({ csrfToken: token });
}

function requireCsrfToken(req, res, next) {
  if (!unsafeMethods.has(req.method)) return next();

  const cookieToken = req.cookies && req.cookies[csrfCookieField];
  const headerToken = req.get('x-csrf-token');
  if (!tokensMatch(cookieToken, headerToken)) {
    return res.status(403).json({
      error: { code: 'INVALID_CSRF_TOKEN', message: 'Invalid or missing CSRF token' },
    });
  }
  return next();
}

module.exports = {
  createCsrfToken,
  issueCsrfToken,
  requireCsrfToken,
  tokensMatch,
};
