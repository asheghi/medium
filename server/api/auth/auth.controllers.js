const { PrismaClient } = require('@prisma/client');

const { comparePassword } = require('../../lib/utils');

const prisma = new PrismaClient();
module.exports.Auth = {};

module.exports.Auth.login = async (email, password) => {
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
