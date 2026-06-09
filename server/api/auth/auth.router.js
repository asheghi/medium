const Express = require('express');
const { rateLimit } = require('express-rate-limit');
const { authGuard } = require('./auth.middleware');
const { AuthService } = require('./auth.service');
const {
  sessionCookieField, authCookieOptions,
} = require('../../server-conf');
const { asyncHandler } = require('../../lib/async-handler');
const { issueCsrfToken } = require('../../lib/csrf.middleware');

const app = Express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(Express.json({ limit: '16kb' }));

app.get('/csrf', issueCsrfToken);

function parseCredentials(body) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 200) return null;
  return { email, password };
}

app.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const credentials = parseCredentials(req.body);
  if (!credentials) return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  const user = await AuthService.login(credentials.email, credentials.password);
  if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });

  const previousToken = req.cookies && req.cookies[sessionCookieField];
  await AuthService.revokeSession(previousToken);
  const token = await AuthService.createSession(user.id);
  res.cookie(sessionCookieField, token, authCookieOptions);
  return res.json({ success: true });
}));

app.post('/logout', asyncHandler(async (req, res) => {
  const token = req.cookies && req.cookies[sessionCookieField];
  await AuthService.revokeSession(token);
  const { maxAge, ...clearOptions } = authCookieOptions;
  res.clearCookie(sessionCookieField, clearOptions);
  return res.status(204).send();
}));

app.use(authGuard);

app.get('/me', (req, res) => {
  const { id, email } = req.user;
  res.json({ id, email });
});

module.exports.AuthRouter = app;
