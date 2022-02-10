const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../../lib/utils');

const prisma = new PrismaClient();
const users = [
/*  {
    email: process.env.DEFAULT_EMAIL || 'admin@test.com',
    password: process.env.DEFAULT_PASSWORD || 'password',
  }, */
];

module.exports = async () => {
  const promises = users.map((user) => prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {},
    create: { ...user, password: hashPassword(user.password) },
  }));
  return Promise.all(promises);
};
