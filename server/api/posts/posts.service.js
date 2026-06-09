const slugify = require('slugify');
const { prisma } = require('../../lib/prisma');

const serializePost = (post) => (post ? { ...post, published: post.status === 'PUBLISHED' } : post);

const create = (postArg) => {
  const post = postArg;
  if (!post.slug) post.slug = slugify(post.title || '');
  return prisma.post.create({
    data: post,
  }).then(serializePost);
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
    status: true,
  },
}).then((posts) => posts.map(serializePost));
const updateOne = (where, body) => prisma.post.update({
  where,
  data: body,
}).then(serializePost);
const findOne = (where) => prisma.post.findUnique({ where }).then(serializePost);
const deleteOne = (where) => prisma.post.delete({ where }).then(serializePost);

module.exports.PostService = {
  create,
  getAll,
  findOne,
  updateOne,
  deleteOne,
};
