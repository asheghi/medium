const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@127.0.0.1:5432/test';
process.env.MINIO_END_POINT_URL = process.env.MINIO_END_POINT_URL || '127.0.0.1';
process.env.MINIO_PORT = process.env.MINIO_PORT || '9000';
process.env.MINIO_ROOT_USER = process.env.MINIO_ROOT_USER || 'test-access-key';
process.env.MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD || 'test-secret-key';
process.env.MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'test-bucket';

const { createApp } = require('../../server/app');
const { AuthService } = require('../../server/api/auth/auth.service');
const { PostService } = require('../../server/api/posts/posts.service');

const postId = '2f1c728d-244e-4b38-91f7-c1d6b573fbd9';

function commandError(statusCode, code, message, extra = {}) {
  return Object.assign(new Error(message), { statusCode, code, ...extra });
}

test('admin post API handles versioned publishing commands and conflicts', async (t) => {
  const originalAuth = { ...AuthService };
  const originalPosts = { ...PostService };
  AuthService.getSessionUser = async (token) => (token === 'post-api-session'
    ? { id: '8e133d9e-5e77-43ba-9bc6-107f965d8868', email: 'admin@example.com' }
    : null);

  const app = await createApp({ includeSsr: false });
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => {
    server.once('listening', resolve);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  t.after(async () => {
    Object.assign(AuthService, originalAuth);
    Object.assign(PostService, originalPosts);
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
  const { csrfToken } = await csrfResponse.json();
  const csrfCookie = csrfResponse.headers.getSetCookie()[0].split(';', 1)[0];
  const headers = {
    'content-type': 'application/json',
    cookie: `auth.session=post-api-session; ${csrfCookie}`,
    'x-csrf-token': csrfToken,
  };

  PostService.saveDraft = async (id, expectedVersion, draft) => {
    assert.equal(id, postId);
    assert.equal(expectedVersion, 2);
    assert.deepEqual(draft, { draftTitle: 'Revised' });
    return {
      id, draftTitle: draft.draftTitle, status: 'DRAFT', version: 3, published: false,
    };
  };
  let response = await fetch(`${baseUrl}/api/admin/posts/${postId}/draft`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ expectedVersion: 2, draftTitle: 'Revised', authorId: 'ignored' }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).version, 3);

  PostService.publish = async (id, expectedVersion, post) => {
    assert.equal(expectedVersion, 3);
    assert.equal(post.slug, 'revised-post');
    assert.equal(post.content, '<p>Allowed</p>');
    return {
      id, ...post, title: post.draftTitle, status: 'PUBLISHED', version: 4, published: true,
    };
  };
  response = await fetch(`${baseUrl}/api/admin/posts/${postId}/publish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      expectedVersion: 3,
      draftTitle: 'Revised Post',
      draftContent: '<p>Allowed</p><script>blocked()</script>',
    }),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'PUBLISHED');

  PostService.unpublish = async (id, expectedVersion) => ({
    id, status: 'DRAFT', version: expectedVersion + 1, published: false,
  });
  response = await fetch(`${baseUrl}/api/admin/posts/${postId}/unpublish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ expectedVersion: 4 }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: postId, status: 'DRAFT', version: 5, published: false,
  });

  PostService.saveDraft = async () => {
    throw commandError(409, 'VERSION_CONFLICT', 'Post has changed', {
      details: { latestVersion: 8 },
    });
  };
  response = await fetch(`${baseUrl}/api/admin/posts/${postId}/draft`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ expectedVersion: 2, draftTitle: 'Stale' }),
  });
  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    error: {
      code: 'VERSION_CONFLICT', message: 'Post has changed', latestVersion: 8,
    },
  });

  PostService.publish = async () => {
    throw commandError(409, 'SLUG_CONFLICT', 'Slug is already in use', { fields: ['slug'] });
  };
  response = await fetch(`${baseUrl}/api/admin/posts/${postId}/publish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      expectedVersion: 3,
      draftTitle: 'Revised Post',
      draftContent: '<p>Allowed</p>',
      slug: 'existing',
    }),
  });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, 'SLUG_CONFLICT');

  PostService.findOne = async () => null;
  response = await fetch(`${baseUrl}/api/admin/posts/${postId}`, {
    headers: { cookie: 'auth.session=post-api-session' },
  });
  assert.equal(response.status, 404);
  assert.equal((await response.json()).error.code, 'NOT_FOUND');
});
