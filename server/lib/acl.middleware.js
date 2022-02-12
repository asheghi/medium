const { authMiddleware } = require('../api/auth/auth.middleware');

module.exports.accessControlMiddleware = async (req, res, next) => {
  const { url } = req;
  if (url.startsWith('/auth') || url.startsWith('/admin')) {
    await new Promise((r) => {
      authMiddleware(req, res, r);
    });
  }

  if (req.user && url.startsWith('/auth')) {
    return res.redirect('/admin');
  }

  if (!req.user && url.startsWith('/admin')) {
    return res.redirect('/auth/login');
  }

  return next();
};
