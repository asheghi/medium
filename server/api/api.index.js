const Express = require('express');
const { AuthRouter } = require('./auth/auth.router');
const { PostsRouter } = require('./posts/posts.router');

const baseUrlApi = '/api';
const app = Express.Router();

app.use(`${baseUrlApi}/auth`, AuthRouter);
app.use(`${baseUrlApi}/posts`, PostsRouter);

module.exports.ApiRouter = app;
