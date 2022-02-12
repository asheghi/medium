const Express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const sharp = require('sharp');
const { authGuard } = require('../auth/auth.middleware');
const { mediaDir } = require('../../server-conf');
const { MediaService } = require('./media.service');

const prisma = new PrismaClient();

const upload = multer({ dest: mediaDir });
const app = Express.Router();

app.get('/:filename', async (req, res) => {
  const { filename } = req.params;
  const image = await prisma.image.findUnique({ where: { filename } });
  if (!image) return res.status(404).send();

  const { width: qWidth, height: qHeight } = req.query;

  const width = qWidth ? +qWidth : null;
  const height = qHeight ? +qHeight : null;
  res.set('Cache-Control', 'public, max-age=0');
  res.type(`image/${image.format}`);
  const imagePath = path.join(mediaDir, filename);
  sharp(imagePath).resize({ width, height }).pipe(res);
});

app.use(authGuard);

app.post('/upload', upload.any(), async (req, res) => {
  if (!req.files.length) return res.status(400).json({ msg: 'no files uploaded' });

  const promises = req.files.map(MediaService.handleUploadedFile);
  const images = await Promise.all(promises);
  res.json(images);
});

app.post('/fromUrl', async (req, res) => {
  // todo download images from request.body
  // handle images like handleUploadedFile
});

app.get('/', async (req, res) => {
  const images = await prisma.image.findMany();
  res.json(images);
});

module.exports.MediaRouter = app;
