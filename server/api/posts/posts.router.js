const Express = require('express');
const bodyParser = require('body-parser');
const { PostService } = require('./posts.service');

const app = Express.Router();

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const post = req.body;
  post.authorId = req.session.user.id;
  const result = await PostService.create(post);
  if (req.query.redirect) {
    return res.redirect(`/admin/post/${result.id}/edit`);
  }
  res.json(result);
});
app.get('/create', async (req, res) => {
  const post = {
    draftTitle: 'No Title',
    draftContent: 'write anything you with ...',
    authorId: req.session.user.id,
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

app.get('/', async (req, res) => {
  const posts = await PostService.getAll();
  res.json(posts);
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

app.put('/:postId', async (req, res) => {
  const { body } = req;
  const { postId } = req.params;
  const post = await PostService.updateOne({ id: +postId }, body);
  res.json(post);
});

module.exports.PostsRouter = app;
