const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { ApiRouter } = require('./api/api.index');
const { accessControlMiddleware } = require('./lib/acl.middleware');

const root = `${__dirname}/..`;

async function createApp({ includeSsr = true } = {}) {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet({
    contentSecurityPolicy: isProduction ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    } : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
  }));
  app.use(cookieParser());
  app.use(ApiRouter);

  if (!includeSsr) return app;

  const { createDevMiddleware, renderPage } = await import('vike/server');
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, {
      cacheControl: 'public, max-age=86400',
    }));
  } else {
    const { devMiddleware } = await createDevMiddleware({ root });
    app.use(devMiddleware);
  }

  app.use(accessControlMiddleware);
  app.get('*', async (req, res, next) => {
    try {
      const pageContext = await renderPage({
        urlOriginal: req.originalUrl,
        headersOriginal: req.headers,
        user: req.user,
        reqQuery: req.query,
      });
      const { httpResponse } = pageContext;
      if (!httpResponse) return next();
      const { body, statusCode, headers } = httpResponse;
      headers.forEach(([name, value]) => res.setHeader(name, value));
      return res.status(statusCode).send(body);
    } catch (error) {
      return next(error);
    }
  });

  return app;
}

module.exports = { createApp };
