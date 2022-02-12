const Express = require('express');
const bodyParser = require('body-parser');
const { PostService } = require('./posts.service');
const { randomString } = require('../../lib/utils');
const { authGuard } = require('../auth/auth.middleware');

const app = Express.Router();

app.use(bodyParser.json());

app.use(authGuard);

app.post('/', async (req, res) => {
  const post = req.body;
  post.authorId = req.user.id;
  const result = await PostService.create(post);
  if (req.query.redirect) {
    return res.redirect(`/admin/post/${result.id}/edit`);
  }
  res.json(result);
});

app.get('/', async (req, res) => {
  const posts = await PostService.getAll();
  res.json(posts);
});

app.get('/create', async (req, res) => {
  const post = {
    draftTitle: 'Untitled',
    draftContent: 'Put down what you want to say ...',
    authorId: req.user.id,
    slug: randomString(14),
  };
  const result = await PostService.create(post);
  return res.redirect(`/admin/post/${result.id}/edit`);
});

app.post('/save/:id', async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  post.updatedAt = new Date();
  const result = await PostService.updateOne({ id: +id }, post);
  res.json(result);
});

app.post('/publish/:id', async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  post.content = post.draftContent;
  post.title = post.draftTitle;
  post.draftTitle = null;
  post.draftContent = null;
  post.published = true;
  post.publishedAt = new Date();
  post.updatedAt = new Date();
  const result = await PostService.updateOne({ id: +id }, post);
  res.json(result);
});

app.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await PostService.findOne({ id: +postId });
  res.json(post);
});

app.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await PostService.deleteOne({ id: +postId });
  res.json(post);
});
app.post('/unpublish/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await PostService.updateOne({ id: +postId }, { published: false });
  res.json(post);
});

app.put('/:postId', async (req, res) => {
  const { body } = req;
  const { postId } = req.params;
  const post = await PostService.updateOne({ id: +postId }, body);
  res.json(post);
});

module.exports.PostsRouter = app;
