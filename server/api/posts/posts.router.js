const Express = require('express');
const { PostService } = require('./posts.service');
const { randomString } = require('../../lib/utils');
const { authGuard } = require('../auth/auth.middleware');
const { asyncHandler } = require('../../lib/async-handler');
const { sanitizePostHtml } = require('../../lib/content-sanitizer.cjs');
const {
  buildDraftCommandInput,
  buildPublishCommandInput,
  buildVersionCommandInput,
  parsePostId,
} = require('../../lib/post-input');

const app = Express.Router();

app.use(Express.json({ limit: '2mb' }));

app.use(authGuard);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.post('/', asyncHandler(async (req, res) => {
  const post = {
    draftTitle: 'Untitled',
    draftContent: 'Put down what you want to say ...',
    authorId: req.user.id,
    slug: randomString(14),
  };
  const result = await PostService.create(post);
  return res.status(201).json(result);
}));

app.get('/', asyncHandler(async (req, res) => {
  const posts = await PostService.getAll();
  return res.json(posts);
}));

app.patch('/:id/draft', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.id);
  const { expectedVersion, draft } = buildDraftCommandInput(req.body);
  const result = await PostService.saveDraft(id, expectedVersion, draft);
  return res.json(result);
}));

app.post('/:id/publish', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.id);
  const { expectedVersion, post } = buildPublishCommandInput(req.body);
  post.content = sanitizePostHtml(post.draftContent);
  const result = await PostService.publish(id, expectedVersion, post);
  return res.json(result);
}));

app.post('/:id/unpublish', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.id);
  const { expectedVersion } = buildVersionCommandInput(req.body);
  const post = await PostService.unpublish(id, expectedVersion);
  return res.json(post);
}));

app.get('/:postId', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.postId);
  const post = await PostService.findOne({ id });
  if (!post) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } });
  return res.json(post);
}));

app.delete('/:postId', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.postId);
  const post = await PostService.deleteOne({ id });
  return res.json(post);
}));

module.exports.PostsRouter = app;
