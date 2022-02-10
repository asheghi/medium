const express = require('express');
const { createPageRenderer } = require('vite-plugin-ssr');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { ApiRouter } = require('./api/api.index');
const { seedDatabase } = require('./lib/seeder');
const { accessControlMiddleware } = require('./lib/acl.middleware');

const isProduction = process.env.NODE_ENV === 'production';
const root = `${__dirname}/..`;

async function startServer() {
  await seedDatabase();

  const app = express();

  app.use(session({
    store: new FileStore({}),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

  app.use(ApiRouter);

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    // eslint-disable-next-line global-require
    const vite = require('vite');
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' },
    });
    app.use(viteDevServer.middlewares);
  }

  app.use(accessControlMiddleware);
  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      url,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse, redirect } = pageContext;
    if (redirect) return res.redirect(redirect);
    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    return res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${port}`);
}

startServer();
