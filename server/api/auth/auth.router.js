const Express = require('express');
const bodyParser = require('body-parser');
const { authMiddleware } = require('./auth.middleware');
const { AuthService } = require('./auth.service');

const app = Express.Router();

app.post('/setup', bodyParser.json(), async (req, res, next) => {
  const { body: { email, password } } = req;
  const user = await AuthService.setupAdminUser(email, password);
  if (!user) {
    return res.status(400).send('something is not right!');
  }
  req.session.user = user;
  req.session.save();
  return res.json({ success: !!user });
});

app.post('/login', bodyParser.json(), async (req, res, next) => {
  const { body: { email, password } } = req;
  const user = await AuthService.login(email, password);
  if (user) {
    req.session.user = user;
    req.session.save();
  }
  res.json({ success: !!user });
});

app.use(authMiddleware);
app.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.send('ok');
});
app.get('/me', (req, res) => {
  const { email } = req.session.user;
  res.json({ email });
});
module.exports.AuthRouter = app;
