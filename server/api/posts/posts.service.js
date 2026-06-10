const slugify = require('slugify');
const { prisma } = require('../../lib/prisma');

const serializePost = (post) => (post ? { ...post, published: post.status === 'PUBLISHED' } : post);

function postNotFoundError() {
  return Object.assign(new Error('Post not found'), {
    statusCode: 404,
    code: 'POST_NOT_FOUND',
  });
}

function versionConflictError(latestVersion) {
  return Object.assign(new Error('Post has been modified by another request'), {
    statusCode: 409,
    code: 'VERSION_CONFLICT',
    details: { latestVersion },
  });
}

function slugConflictError() {
  return Object.assign(new Error('Slug is already in use'), {
    statusCode: 409,
    code: 'SLUG_CONFLICT',
    fields: ['slug'],
  });
}

const create = (postArg) => {
  const post = postArg;
  if (!post.slug) post.slug = slugify(post.title || '');
  return prisma.post.create({
    data: post,
  }).then(serializePost);
};
const getAll = () => prisma.post.findMany({
  orderBy: [{ createdAt: 'desc' }],
}).then((posts) => posts.map(serializePost));
const findOne = (where) => prisma.post.findUnique({ where }).then(serializePost);

async function classifyMissingUpdate(id) {
  const latest = await prisma.post.findUnique({ where: { id }, select: { version: true } });
  if (!latest) throw postNotFoundError();
  throw versionConflictError(latest.version);
}

async function updateVersioned(id, expectedVersion, data) {
  let posts;
  try {
    posts = await prisma.post.updateManyAndReturn({
      where: { id, version: expectedVersion },
      data: { ...data, version: { increment: 1 } },
    });
  } catch (error) {
    if (error && error.code === 'P2002') throw slugConflictError();
    throw error;
  }
  if (!posts.length) return classifyMissingUpdate(id);
  return serializePost(posts[0]);
}

const saveDraft = (id, expectedVersion, draft) => updateVersioned(id, expectedVersion, draft);

const publish = (id, expectedVersion, post) => updateVersioned(id, expectedVersion, {
  ...post,
  title: post.draftTitle,
  content: post.content,
  status: 'PUBLISHED',
  publishedAt: new Date(),
});

const unpublish = (id, expectedVersion) => updateVersioned(id, expectedVersion, {
  status: 'DRAFT',
});

async function deleteOne(where) {
  try {
    return serializePost(await prisma.post.delete({ where }));
  } catch (error) {
    if (error && error.code === 'P2025') throw postNotFoundError();
    throw error;
  }
}

module.exports.PostService = {
  create,
  getAll,
  findOne,
  saveDraft,
  publish,
  unpublish,
  deleteOne,
};
