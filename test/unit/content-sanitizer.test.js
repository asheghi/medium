const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitizePostHtml } = require('../../server/lib/content-sanitizer.cjs');

test('removes executable HTML while preserving post formatting', () => {
  const input = '<h2>Title</h2><script>alert(1)</script><img src="/image.jpg" onerror="alert(2)">';
  const output = sanitizePostHtml(input);

  assert.match(output, /<h2>Title<\/h2>/);
  assert.match(output, /<img src="\/image.jpg" \/>/);
  assert.doesNotMatch(output, /script|onerror/);
});

test('removes unsafe link protocols and secures new windows', () => {
  const output = sanitizePostHtml('<a href="javascript:alert(1)" target="_blank">Bad</a>');

  assert.doesNotMatch(output, /javascript:/);
  assert.match(output, /rel="noopener noreferrer"/);
});
