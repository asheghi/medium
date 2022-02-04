const Express = require('express');
const { AuthRouter } = require('./auth/auth.router');

const baseUrlApi = '/api';
const app = Express.Router();

app.use(`${baseUrlApi}/auth`, AuthRouter);

module.exports.ApiRouter = app;
