const express = require('express');
const { createPageRenderer } = require('vite-plugin-ssr');
const cookieParser = require('cookie-parser');
const { ApiRouter } = require('./api/api.index');
const { accessControlMiddleware } = require('./lib/acl.middleware');

const isProduction = process.env.NODE_ENV === 'production';
const root = `${__dirname}/..`;

async function startServer() {
  const app = express();
  app.enable('trust proxy');
  app.use(cookieParser());
  app.use(ApiRouter);

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, {
      // cache static assets for 24 hours
      cacheControl: 'public, max-age=86400',
    }));
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
    const { user } = req;
    const pageContextInit = {
      url, user, reqQuery: req.query,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse, redirect, cacheControl } = pageContext;
    if (redirect) return res.redirect(redirect);
    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    if (cacheControl) res.set('Cache-Control', cacheControl);
    return res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT || 3000;
  const hostname = process.env.HOST || '127.0.0.1';
  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Blog is listening at http://${hostname}:${port}`);
    console.log(`Access Admin Dashboard at http://${hostname}:${port}/admin`);
    try {
      process.send('ready');
    } catch (e) {
    }
  });
}

startServer();
