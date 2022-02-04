const Express = require('express');
const bodyParser = require('body-parser');
const { Auth } = require('./auth.controllers');
const { authMiddleware } = require('./auth.middleware');

const app = Express.Router();

app.post('/login', bodyParser.json(), async (req, res, next) => {
  const { body: { email, password } } = req;
  const user = await Auth.login(email, password);
  if (user) {
    req.session.user = user;
    req.session.save();
  }
  res.json({ success: !!user });
});
app.post('/logout', authMiddleware, (req, res, next) => {
  req.session.destroy();
});
app.get('/me', authMiddleware, (req, res) => {
  const { email } = req.session.user;
  res.json({ email });
});
module.exports.AuthRouter = app;
