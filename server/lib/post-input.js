const slugify = require('slugify');

class InputError extends Error {
  constructor(message, fields) {
    super(message);
    this.statusCode = 400;
    this.code = 'INVALID_INPUT';
    this.fields = fields;
  }
}

function requireObject(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new InputError('Request body must be an object');
  }
}

function optionalString(body, field, maxLength, allowNull = true) {
  const value = body[field];
  if (value === undefined) return undefined;
  if (value === null && allowNull) return null;
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new InputError(`${field} must be a string of at most ${maxLength} characters`, [field]);
  }
  return value;
}

function buildDraftInput(body) {
  requireObject(body);
  const result = {};
  const draftTitle = optionalString(body, 'draftTitle', 300);
  const draftContent = optionalString(body, 'draftContent', 2000000);
  if (draftTitle !== undefined) result.draftTitle = draftTitle;
  if (draftContent !== undefined) result.draftContent = draftContent;
  if (!Object.keys(result).length) throw new InputError('No supported draft fields were provided');
  return result;
}

function buildPublishInput(body) {
  requireObject(body);
  const draftTitle = optionalString(body, 'draftTitle', 300, false);
  const draftContent = optionalString(body, 'draftContent', 2000000, false);
  const summary = optionalString(body, 'summary', 1000);
  const twitter = optionalString(body, 'twitter', 2048);
  const requestedSlug = optionalString(body, 'slug', 200);

  if (!draftTitle || !draftTitle.trim()) throw new InputError('draftTitle is required', ['draftTitle']);
  if (!draftContent || !draftContent.trim()) throw new InputError('draftContent is required', ['draftContent']);

  const slug = slugify(requestedSlug || draftTitle, { lower: true, strict: true, trim: true });
  if (!slug) throw new InputError('A valid slug is required', ['slug']);

  if (twitter) {
    let url;
    try {
      url = new URL(twitter);
    } catch (error) {
      throw new InputError('twitter must be a valid HTTPS URL', ['twitter']);
    }
    if (url.protocol !== 'https:') throw new InputError('twitter must be a valid HTTPS URL', ['twitter']);
  }

  return {
    draftTitle: draftTitle.trim(),
    draftContent,
    slug,
    summary: summary === undefined ? null : summary,
    twitter: twitter === undefined ? null : twitter,
  };
}

function parsePostId(value) {
  if (typeof value !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new InputError('Invalid post id', ['id']);
  }
  return value.toLowerCase();
}

module.exports = {
  InputError,
  buildDraftInput,
  buildPublishInput,
  parsePostId,
};
