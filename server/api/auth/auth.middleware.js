const { AuthService } = require('./auth.service');
const { getServerDebug } = require('../../lib/utils');
const { sessionCookieField } = require('../../server-conf');

const debug = getServerDebug('auth:middleware');

async function authenticateRequest(req, res, next) {
  try {
    const token = req.cookies && req.cookies[sessionCookieField];
    req.user = await AuthService.getSessionUser(token);
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports.authenticateRequest = authenticateRequest;

module.exports.authGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } });
  }
  return next();
};

module.exports.redirectUnAuthenticated = (req, res, next) => {
  if (req.user) return next();
  debug('redirecting to login');
  return res.redirect('/auth/login');
};

module.exports.redirectAuthenticated = (req, res, next) => {
  if (!req.user) return next();
  debug('redirecting to admin');
  return res.redirect('/admin');
};
