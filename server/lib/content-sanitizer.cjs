const sanitizeHtml = require('sanitize-html');

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  'h1', 'h2', 'img', 'pre', 'code', 'span', 's', 'u',
]);

module.exports.sanitizePostHtml = (html) => sanitizeHtml(html || '', {
  allowedTags,
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    code: ['class'],
    span: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.target === '_blank'
        ? { ...attribs, rel: 'noopener noreferrer' }
        : attribs,
    }),
  },
});
