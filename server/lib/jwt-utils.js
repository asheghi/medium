const jwt = require('jsonwebtoken');
const hash = require('object-hash');
const { jwtCookieField, jwtSecret, jwtExpiresIn } = require('../server-conf');

module.exports.JwtUtils = {
  generateTokenForPayload(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  },
  generateTokenForRequest(req, extraPayload) {
    const { ip } = req;
    const userAgent = req.headers['user-agent'];
    const sessionHash = hash({ ip, userAgent });
    const payload = { ...extraPayload, __h: sessionHash };
    return this.generateTokenForPayload(payload);
  },
  verifyRequest(req) {
    if (!req.cookies) return false;

    const token = req.cookies[jwtCookieField];
    const payload = this.verifyToken(token);
    if (!payload || typeof payload !== 'object') return false;
    const { __h } = payload;
    const { ip } = req;
    const userAgent = req.headers['user-agent'];
    const sessionHash = hash({ ip, userAgent });
    const valid = __h === sessionHash;
    if (valid) {
      req.user = payload;
    }
    return valid;
  },
  verifyToken(token) {
    if (!token) return false;
    try {
      return jwt.verify(token, jwtSecret);
    } catch (e) {
      return false;
    }
  },
};
