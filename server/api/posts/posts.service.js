const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

const create = (postArg) => {
  const post = postArg;
  if (!post.slug) post.slug = slugify(post.title || '');
  return prisma.post.create({
    data: post,
  });
};
const getAll = () => prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    content: true,
    author: {
      select: {
        name: true,
      },
    },
  },
});
const updateOne = (where, body) => prisma.post.update({
  where,
  data: body,
});
const findOne = (where) => prisma.post.findUnique({ where });
const deleteOne = (where) => prisma.post.delete({ where });

module.exports.PostService = {
  create,
  getAll,
  findOne,
  updateOne,
  deleteOne,
};
