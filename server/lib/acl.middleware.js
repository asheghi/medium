module.exports.accessControlMiddleware = async (req, res, next) => {
  const { url } = req;
  if (req.user && url.startsWith('/auth')) {
    return res.redirect('/admin');
  }

  if (!req.user && url.startsWith('/admin')) {
    return res.redirect('/auth/login');
  }

  return next();
};
