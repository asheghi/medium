const jwt = require('jsonwebtoken');
const hash = require('object-hash');
const { jwtCookieField, jwtSecret } = require('../server-conf');

module.exports.JwtUtils = {
  generateTokenForPayload(payload) {
    return jwt.sign(payload, jwtSecret);
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
    const validSignature = this.verifyToken(token);
    if (!validSignature) return false;

    const payload = this.decodeToken(token);
    const { __h } = payload;
    const { ip } = req;
    const userAgent = req.headers['user-agent'];
    const sessionHash = hash({ ip, userAgent });
    const valid = __h === sessionHash;
    if (valid) {
      req.user = payload;
    }
    req.user = this.decodeToken(token);
    return true;
  },
  verifyToken(token) {
    if (!token) return false;
    let valid = false;
    try {
      jwt.verify(token, jwtSecret);
      valid = true;
    } catch (e) {
      console.error(e);
      valid = false;
      // nothing
    }
    return valid;
  },
  // note decode does not validate token
  decodeToken(token) {
    return jwt.decode(token);
  },
};
