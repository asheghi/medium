const fs = require('fs');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const { join } = require('path');
const { PrismaClient } = require('@prisma/client');
const { mediaDir } = require('../../server-conf');

const prisma = new PrismaClient();

module.exports.MediaService = {
  async handleUploadedFile(file) {
    const {
      path, originalname,
    } = file;
    const buffer = fs.readFileSync(path);
    const metadata = await sharp(buffer).metadata();
    const {
      format, size, width, height,
    } = metadata;
    const filename = `${uuid()}.${format}`;
    const newPath = join(mediaDir, filename);
    fs.renameSync(path, newPath);

    return prisma.image.create({
      data: {
        filename,
        alt: originalname,
        format,
        width,
        height,
        size,
      },
    });
  },
};
