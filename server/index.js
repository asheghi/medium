const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { ApiRouter } = require('./api/api.index');
const { accessControlMiddleware } = require('./lib/acl.middleware');
const { prisma } = require('./lib/prisma');

const isProduction = process.env.NODE_ENV === 'production';
const root = `${__dirname}/..`;

async function startServer() {
  const { createDevMiddleware, renderPage } = await import('vike/server');
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

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, {
      // cache static assets for 24 hours
      cacheControl: 'public, max-age=86400',
    }));
  } else {
    const { devMiddleware } = await createDevMiddleware({ root });
    app.use(devMiddleware);
  }

  app.use(accessControlMiddleware);
  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
      user: req.user,
      reqQuery: req.query,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { body, statusCode, headers } = httpResponse;
    headers.forEach(([name, value]) => res.setHeader(name, value));
    return res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 3000;
  const hostname = process.env.HOST || '127.0.0.1';
  const server = app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Blog is listening at http://${hostname}:${port}`);
    console.log(`Access Admin Dashboard at http://${hostname}:${port}/admin`);
    if (typeof process.send === 'function') {
      process.send('ready');
    }
  });

  async function shutdown(signal) {
    console.log(`Received ${signal}; shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
