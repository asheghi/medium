const Express = require('express');
const { AuthRouter } = require('./auth/auth.router');
const { PostsRouter } = require('./posts/posts.router');
const { MediaRouter } = require('./media/media.router');
const { authenticateRequest } = require('./auth/auth.middleware');
const { requireSameOrigin } = require('../lib/origin.middleware');
const { requireCsrfToken } = require('../lib/csrf.middleware');

const baseUrlApi = '/api';
const app = Express.Router();

// simulate slow network on dev mode
if (process.env.SIMULATE_SLOW_NETWORK) {
  app.use(baseUrlApi, async (req, res, next) => {
    setTimeout(next, 1500);
  });
}
app.use(authenticateRequest);
app.use(baseUrlApi, requireSameOrigin);
app.use(baseUrlApi, requireCsrfToken);
app.use(`${baseUrlApi}/auth`, AuthRouter);
app.use(`${baseUrlApi}/posts`, PostsRouter);
app.use(`${baseUrlApi}/media`, MediaRouter);

app.use(baseUrlApi, (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const multerLimit = typeof err.code === 'string' && err.code.startsWith('LIMIT_');
  const status = err.statusCode || (multerLimit ? 413 : 500);
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  if (status === 500) console.error(err);
  return res.status(status).json({
    error: {
      code,
      message: status === 500 ? 'Internal server error' : err.message,
      ...(err.fields ? { fields: err.fields } : {}),
    },
  });
});

module.exports.ApiRouter = app;
