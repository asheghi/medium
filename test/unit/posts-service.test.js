const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@127.0.0.1:5432/test';

const { prisma } = require('../../server/lib/prisma');
const { PostService } = require('../../server/api/posts/posts.service');

test('post service applies optimistic versions and classifies failed commands', async (t) => {
  const originalUpdate = prisma.post.updateManyAndReturn;
  const originalFind = prisma.post.findUnique;
  t.after(() => {
    prisma.post.updateManyAndReturn = originalUpdate;
    prisma.post.findUnique = originalFind;
  });

  prisma.post.updateManyAndReturn = async (args) => {
    assert.deepEqual(args.where, { id: 'post-id', version: 4 });
    assert.deepEqual(args.data.version, { increment: 1 });
    return [{ id: 'post-id', status: 'DRAFT', version: 5 }];
  };
  const post = await PostService.saveDraft('post-id', 4, { draftTitle: 'Changed' });
  assert.equal(post.version, 5);
  assert.equal(post.published, false);

  prisma.post.updateManyAndReturn = async () => [];
  prisma.post.findUnique = async () => ({ version: 9 });
  await assert.rejects(PostService.unpublish('post-id', 4), (error) => {
    assert.equal(error.code, 'VERSION_CONFLICT');
    assert.equal(error.details.latestVersion, 9);
    return true;
  });

  prisma.post.findUnique = async () => null;
  await assert.rejects(PostService.saveDraft('missing', 1, { draftTitle: 'Changed' }), (error) => {
    assert.equal(error.code, 'POST_NOT_FOUND');
    assert.equal(error.statusCode, 404);
    return true;
  });

  prisma.post.updateManyAndReturn = async () => {
    throw Object.assign(new Error('Unique constraint'), { code: 'P2002' });
  };
  await assert.rejects(PostService.publish('post-id', 1, {
    draftTitle: 'Post', draftContent: '<p>Post</p>', content: '<p>Post</p>', slug: 'used',
  }), (error) => {
    assert.equal(error.code, 'SLUG_CONFLICT');
    assert.equal(error.statusCode, 409);
    return true;
  });
});
