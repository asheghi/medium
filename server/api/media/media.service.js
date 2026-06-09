const fs = require('fs');
const sharp = require('sharp');
const { randomUUID } = require('crypto');
const { join } = require('path');
const { mediaDir } = require('../../server-conf');
const { prisma } = require('../../lib/prisma');

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
    const filename = `${randomUUID()}.${format}`;
    const newPath = join(mediaDir, filename);
    fs.renameSync(path, newPath);

    return prisma.media.create({
      data: {
        objectKey: filename,
        originalFilename: originalname,
        mimeType: `image/${format}`,
        width,
        height,
        byteSize: size,
      },
    });
  },
};
