const { createApp } = require('./app');
const { prisma } = require('./lib/prisma');

async function startServer() {
  const app = await createApp();

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
