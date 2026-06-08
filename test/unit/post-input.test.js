const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildDraftInput,
  buildPublishInput,
  parsePostId,
} = require('../../server/lib/post-input');

test('draft input only returns fields clients are allowed to edit', () => {
  const input = buildDraftInput({
    draftTitle: 'Draft',
    draftContent: '<p>Text</p>',
    authorId: 999,
    published: true,
    createdAt: new Date().toISOString(),
  });

  assert.deepEqual(input, { draftTitle: 'Draft', draftContent: '<p>Text</p>' });
});

test('publish input normalizes the slug and keeps supported metadata', () => {
  const input = buildPublishInput({
    draftTitle: ' A Useful Post ',
    draftContent: '<p>Content</p>',
    slug: 'A Useful Post!',
    summary: 'Summary',
    twitter: 'https://example.com/discussion',
    authorId: 999,
  });

  assert.equal(input.draftTitle, 'A Useful Post');
  assert.equal(input.slug, 'a-useful-post');
  assert.equal(input.summary, 'Summary');
  assert.equal(input.twitter, 'https://example.com/discussion');
  assert.equal(input.authorId, undefined);
});

test('publish input rejects unsafe discussion URLs', () => {
  const unsafeProtocol = ['java', 'script:alert(1)'].join('');
  assert.throws(() => buildPublishInput({
    draftTitle: 'Post',
    draftContent: '<p>Content</p>',
    twitter: unsafeProtocol,
  }), /valid HTTPS URL/);
});

test('post ids must be positive safe integers', () => {
  assert.equal(parsePostId('42'), 42);
  assert.throws(() => parsePostId('-1'), /Invalid post id/);
  assert.throws(() => parsePostId('abc'), /Invalid post id/);
});
