const Express = require('express');
const bodyParser = require('body-parser');
const { PostService } = require('./posts.service');

const app = Express.Router();

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const post = req.body;
  post.authorId = req.session.user.id;
  const result = await PostService.create(post);
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
