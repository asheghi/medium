const { PrismaClient } = require('@prisma/client');

const { comparePassword, hashPassword } = require('../../lib/utils');

const prisma = new PrismaClient();
module.exports.AuthService = {};

module.exports.AuthService.login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    const result = comparePassword(user.password, password);
    return result ? user : null;
  }
  await new Promise((r) => {
    setTimeout(r, 500 + (Math.random() * 500));
  });
  return null;
};
module.exports.AuthService.setupAdminUser = async (email, password) => {
  const hasSetup = await prisma.user.findFirst({});
  if (hasSetup) return false;

  return prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
    },
  });
};
