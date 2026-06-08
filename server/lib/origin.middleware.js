const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

module.exports.requireSameOrigin = (req, res, next) => {
  if (!unsafeMethods.has(req.method)) return next();

  const origin = req.get('origin');
  if (!origin) return next();

  try {
    const expectedOrigin = `${req.protocol}://${req.get('host')}`;
    if (new URL(origin).origin !== expectedOrigin) {
      return res.status(403).json({ error: { code: 'INVALID_ORIGIN', message: 'Invalid request origin' } });
    }
  } catch (error) {
    return res.status(403).json({ error: { code: 'INVALID_ORIGIN', message: 'Invalid request origin' } });
  }

  return next();
};
