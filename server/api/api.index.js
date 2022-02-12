const Express = require('express');
const { AuthRouter } = require('./auth/auth.router');
const { PostsRouter } = require('./posts/posts.router');
const { MediaRouter } = require('./media/media.router');
const { authenticateRequest } = require('./auth/auth.middleware');

const baseUrlApi = '/api';
const app = Express.Router();

// simulate slow network on dev mode
if (process.env.SIMULATE_SLOW_NETWORK) {
  app.use(baseUrlApi, async (req, res, next) => {
    setTimeout(next, 1500);
  });
}
app.use(authenticateRequest);
app.use(`${baseUrlApi}/auth`, AuthRouter);
app.use(`${baseUrlApi}/posts`, PostsRouter);
app.use(`${baseUrlApi}/media`, MediaRouter);

module.exports.ApiRouter = app;
