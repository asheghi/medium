const Express = require('express');
const bodyParser = require('body-parser');
const { PostService } = require('./posts.service');
const { randomString } = require('../../lib/utils');
const { authGuard } = require('../auth/auth.middleware');
const { asyncHandler } = require('../../lib/async-handler');
const { sanitizePostHtml } = require('../../lib/content-sanitizer.cjs');
const { buildDraftInput, buildPublishInput, parsePostId } = require('../../lib/post-input');

const app = Express.Router();

app.use(bodyParser.json({ limit: '2mb' }));

app.use(authGuard);

app.post('/', asyncHandler(async (req, res) => {
  const post = { ...buildDraftInput(req.body), authorId: req.user.id, slug: randomString(14) };
  const result = await PostService.create(post);
  if (req.query.redirect) {
    return res.redirect(`/admin/post/${result.id}/edit`);
  }
  return res.status(201).json(result);
}));

app.get('/', asyncHandler(async (req, res) => {
  const posts = await PostService.getAll();
  return res.json(posts);
}));

app.post('/anotherOne', asyncHandler(async (req, res) => {
  const post = {
    draftTitle: 'Untitled',
    draftContent: 'Put down what you want to say ...',
    authorId: req.user.id,
    slug: randomString(14),
  };
  const { id } = await PostService.create(post);
  return res.status(200).json({ id });
}));

app.post('/save/:id', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.id);
  const post = buildDraftInput(req.body);
  post.updatedAt = new Date();
  const result = await PostService.updateOne({ id }, post);
  return res.json(result);
}));

app.post('/publish/:id', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.id);
  const post = buildPublishInput(req.body);
  post.content = sanitizePostHtml(post.draftContent);
  post.title = post.draftTitle;
  post.draftTitle = null;
  post.draftContent = null;
  post.status = 'PUBLISHED';
  post.publishedAt = new Date();
  post.updatedAt = new Date();
  const result = await PostService.updateOne({ id }, post);
  return res.json(result);
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
app.post('/unpublish/:postId', asyncHandler(async (req, res) => {
  const id = parsePostId(req.params.postId);
  const post = await PostService.updateOne({ id }, {
    status: 'DRAFT', updatedAt: new Date(),
  });
  return res.json(post);
}));

app.put('/:postId', (req, res) => res.status(405).json({
  error: { code: 'METHOD_NOT_ALLOWED', message: 'Use the draft, publish, or unpublish endpoints' },
}));

module.exports.PostsRouter = app;
