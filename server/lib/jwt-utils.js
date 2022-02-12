const jwt = require('jsonwebtoken');
const hash = require('object-hash');
const { jwtCookieField } = require('../server-conf');

const secret = process.env.JWT_SECRET || 'keyboard cat';

module.exports.JwtUtils = {
  generateTokenForPayload(payload) {
    return jwt.sign(payload, secret);
  },
  generateTokenForRequest(req, extraPayload) {
    const { ip } = req;
    const userAgent = req.headers['user-agent'];
    const sessionHash = hash({ ip, userAgent });
    const payload = { ...extraPayload, __h: sessionHash };
    return this.generateTokenForPayload(payload);
  },
  setToken(res, token) {
    return res.cookie(jwtCookieField, token);
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
    let valid = false;
    try {
      jwt.verify(token, secret);
      valid = true;
    } catch (e) {
      console.error(e.message);
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
