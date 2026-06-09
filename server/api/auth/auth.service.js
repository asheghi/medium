const { prisma } = require('../../lib/prisma');
const { verifyPassword } = require('../../lib/password');
const {
  createSessionToken, getSessionExpiry, hashSessionToken,
} = require('../../lib/session');
const { sessionLifetimeMs } = require('../../server-conf');

const LAST_USED_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await verifyPassword(
      'scrypt-v1$16384$8$1$R6xZQ-RXdgiN5WyRQc1bNg$7I6uWyvQ6hTYkHKCyqG5cqq_z4teovaP2y_UJoDxpEs_afRD24EbX6-RsdfF-y46cHUHc8oIbS-8vN_RGdhk-A',
      password,
    );
    return null;
  }
  return (await verifyPassword(user.passwordHash, password)) ? user : null;
}

async function createSession(userId, now = new Date()) {
  const token = createSessionToken();
  await prisma.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId,
      expiresAt: getSessionExpiry(sessionLifetimeMs, now),
      lastUsedAt: now,
    },
  });
  return token;
}

async function getSessionUser(token, now = new Date()) {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt <= now) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  if (now.getTime() - session.lastUsedAt.getTime() >= LAST_USED_UPDATE_INTERVAL_MS) {
    await prisma.session.update({ where: { id: session.id }, data: { lastUsedAt: now } });
  }
  return { id: session.user.id, email: session.user.email };
}

async function revokeSession(token) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
}

module.exports.AuthService = {
  createSession,
  getSessionUser,
  login,
  revokeSession,
};
