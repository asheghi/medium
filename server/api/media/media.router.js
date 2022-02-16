const Express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { authGuard } = require('../auth/auth.middleware');
const { mediaDir } = require('../../server-conf');
const { ObjectStorage } = require('../../lib/object-storage');

const upload = multer({ dest: mediaDir });
const app = Express.Router();

app.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { width: qWidth, height: qHeight } = req.query;
    const buffer = await ObjectStorage.getObject(filename);
    const metadata = await sharp(buffer).metadata();
    const {
      format,
    } = metadata;

    const width = qWidth ? (+qWidth || null) : null;
    const height = qHeight ? (+qHeight || null) : null;
    res.set('Cache-Control', 'public, max-age=0');
    res.type(`image/${format}`);
    if (width || height) {
      return sharp(buffer).resize({ width, height }).pipe(res);
    }
    return res.end(buffer, 'binary');
  } catch (e) {
    res.status(500).send('error');
  }
});

app.use(authGuard);

app.post('/upload', upload.any(), async (req, res) => {
  if (!req.files.length) return res.status(400).json({ msg: 'no files uploaded' });
  const promises = req.files.map(async (file) => {
    const { path, originalname } = file;
    await ObjectStorage.uploadFile(path, originalname);
    return originalname;
  });

  const images = await Promise.all(promises);
  return res.json(images);
});

app.post('/fromUrl', async (req, res) => {
  // todo download images from request.body
  // handle images like handleUploadedFile
});

app.get('/', async (req, res) => {
  const list = await ObjectStorage.listObjects();
  res.json(list.map((it) => it.name));
});

module.exports.MediaRouter = app;
