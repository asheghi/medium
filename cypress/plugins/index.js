/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {PrismaClient} = require("@prisma/client");
const {hashPassword} = require("../../server/lib/utils");
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    'db:reset': async () => {
      const prisma = new PrismaClient();
      await prisma.post.deleteMany();
      return prisma.user.deleteMany();
    },
    'db:reset-admin': async () => {
      const prisma = new PrismaClient();
      await prisma.post.deleteMany();
      return prisma.user.deleteMany();
    },
    'db:seed-admin': async () => {
      const prisma = new PrismaClient();
      await prisma.post.deleteMany();
      await prisma.user.deleteMany();
      return prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashPassword('password')
        }
      });
    },
    'db:seed-post': async () => {
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst();
      return prisma.post.create({
        data:{
          title:'Dummy Post',
          content: 'Lorem ipsum',
          published:true,
          authorId: user.id,
        }
      })
    }
  })
}
