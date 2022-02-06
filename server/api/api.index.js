const Express = require('express');
const { AuthRouter } = require('./auth/auth.router');
const { PostsRouter } = require('./posts/posts.router');

const baseUrlApi = '/api';
const app = Express.Router();

// simulate slow network on dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(baseUrlApi, async (req, res, next) => {
    setTimeout(next, 1500);
  });
}

app.use(`${baseUrlApi}/auth`, AuthRouter);
app.use(`${baseUrlApi}/posts`, PostsRouter);

module.exports.ApiRouter = app;
