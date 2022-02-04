module.exports.accessControlMiddleware = (req, res, next) => {
  const { url } = req;
  const authed = req.session.user;
  if (authed && url.startsWith('/auth')) {
    return res.redirect('/admin');
  }

  if (!authed && url.startsWith('/admin')) {
    return res.redirect('/auth/login');
  }

  return next();
};
