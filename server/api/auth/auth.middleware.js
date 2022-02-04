module.exports.authMiddleware = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).send();
};

module.exports.redirectUnAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.redirect('/auth/login');
};

module.exports.redirectAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.redirect('/admin');
};
