const Express = require('express');
const bodyParser = require('body-parser');
const { rateLimit } = require('express-rate-limit');
const { authGuard } = require('./auth.middleware');
const { AuthService } = require('./auth.service');
const { JwtUtils } = require('../../lib/jwt-utils');
const { jwtCookieField, authCookieOptions } = require('../../server-conf');
const { asyncHandler } = require('../../lib/async-handler');

const app = Express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(bodyParser.json({ limit: '16kb' }));

function parseCredentials(body) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 200) return null;
  return { email, password };
}

app.post('/setup', authLimiter, asyncHandler(async (req, res) => {
  const credentials = parseCredentials(req.body);
  if (!credentials) return res.status(400).json({ error: { code: 'INVALID_CREDENTIALS', message: 'A valid email and password are required' } });
  const { email, password } = credentials;
  const user = await AuthService.setupAdminUser(email, password);
  if (!user) return res.status(409).json({ error: { code: 'ALREADY_CONFIGURED', message: 'Admin user already exists' } });
  const token = JwtUtils.generateTokenForRequest(req, { email: user.email, id: user.id });
  res.cookie(jwtCookieField, token, authCookieOptions);
  return res.json({ success: !!user });
}));

app.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const credentials = parseCredentials(req.body);
  if (!credentials) return res.status(400).json({ success: false });
  const { email, password } = credentials;
  const user = await AuthService.login(email, password);
  if (!user) return res.status(401).json({ success: false });
  const token = JwtUtils.generateTokenForRequest(req, { email: user.email, id: user.id });
  res.cookie(jwtCookieField, token, authCookieOptions);
  return res.json({ success: true });
}));

app.post('/logout', (req, res) => {
  const { maxAge, ...clearOptions } = authCookieOptions;
  res.clearCookie(jwtCookieField, clearOptions);
  return res.status(204).send();
});

app.use(authGuard);

app.get('/me', (req, res) => {
  const { email } = req.user;
  res.json({ email });
});
module.exports.AuthRouter = app;
