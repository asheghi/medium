const Express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { randomUUID } = require('crypto');
const { authGuard } = require('../auth/auth.middleware');
const { mediaDir } = require('../../server-conf');
const { ObjectStorage } = require('../../lib/object-storage');

fs.mkdirSync(mediaDir, { recursive: true });

const upload = multer({
  dest: mediaDir,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
    fields: 5,
  },
});
const app = Express.Router();
const supportedFormats = new Set(['jpeg', 'png', 'webp', 'gif']);
const maxDimension = 12000;
const maxPixels = 40000000;

function parseResizeDimension(value) {
  if (value === undefined) return null;
  const dimension = Number(value);
  if (!Number.isSafeInteger(dimension) || dimension < 1 || dimension > 2000) return false;
  return dimension;
}

async function removeTemporaryFiles(files = []) {
  await Promise.all(files.map((file) => fs.promises.unlink(file.path).catch(() => {})));
}

function receiveUpload(req, res, next) {
  upload.array('image', 5)(req, res, (error) => {
    if (!error) return next();
    return removeTemporaryFiles(req.files).then(() => next(error), () => next(error));
  });
}

app.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { width: qWidth, height: qHeight } = req.query;
    const buffer = await ObjectStorage.getObject(filename);
    const metadata = await sharp(buffer).metadata();
    const {
      format,
    } = metadata;

    const width = parseResizeDimension(qWidth);
    const height = parseResizeDimension(qHeight);
    if (width === false || height === false) return res.status(400).send('invalid dimensions');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.type(`image/${format}`);
    if (width || height) {
      return sharp(buffer, { limitInputPixels: maxPixels })
        .resize({ width, height, withoutEnlargement: true })
        .pipe(res);
    }
    return res.end(buffer, 'binary');
  } catch (e) {
    const notFound = e.code === 'NoSuchKey' || e.statusCode === 404;
    return res.status(notFound ? 404 : 500).send(notFound ? 'not found' : 'error');
  }
});

app.use(authGuard);

app.post('/upload', receiveUpload, async (req, res, next) => {
  const files = req.files || [];
  const uploadedKeys = [];
  try {
    if (!files.length) return res.status(400).json({ error: { code: 'NO_FILES', message: 'No files uploaded' } });

    // Upload sequentially so a failed request can roll back every object already written.
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      let metadata;
      try {
        // eslint-disable-next-line no-await-in-loop
        metadata = await sharp(file.path, { limitInputPixels: maxPixels }).metadata();
      } catch (cause) {
        const error = new Error('Unsupported image');
        error.statusCode = 415;
        error.code = 'UNSUPPORTED_IMAGE';
        error.cause = cause;
        throw error;
      }
      const { format, width, height } = metadata;
      if (!supportedFormats.has(format)
        || !width || !height
        || width > maxDimension || height > maxDimension
        || width * height > maxPixels) {
        const error = new Error('Unsupported or oversized image');
        error.statusCode = 415;
        error.code = 'UNSUPPORTED_IMAGE';
        throw error;
      }

      const extension = format === 'jpeg' ? 'jpg' : format;
      const objectKey = `${randomUUID()}.${extension}`;
      // eslint-disable-next-line no-await-in-loop
      await ObjectStorage.uploadFile(file.path, objectKey, { 'Content-Type': `image/${format}` });
      uploadedKeys.push(objectKey);
    }

    return res.json(uploadedKeys);
  } catch (error) {
    await Promise.all(uploadedKeys.map((key) => ObjectStorage.removeObject(key).catch(() => {})));
    return next(error);
  } finally {
    await removeTemporaryFiles(files);
  }
});

app.get('/', async (req, res) => {
  const list = await ObjectStorage.listObjects();
  res.json(list.map((it) => it.name));
});

module.exports.MediaRouter = app;
