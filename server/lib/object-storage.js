const Minio = require('minio');
const fs = require('fs');

const bucketName = process.env.S3_BUCKET_NAME;

module.exports.ObjectStorage = {
  client: new Minio.Client({
    endPoint: process.env.S3_END_POINT_URL,
    port: +(process.env.S3_PORT || 443),
    useSSL: process.env.S3_SSL !== 'false',
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
  }),
  listObjects() {
    return new Promise((resolve, reject) => {
      const data = [];
      const stream = this.client.listObjects(bucketName, '', true);
      stream.on('data', (obj) => {
        data.push(obj);
      });
      stream.on('end', () => {
        resolve(data);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  },
  uploadFile(filePath, filename) {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);
      fs.stat(filePath, (err, stats) => {
        if (err) return reject(err);
        return this.client.putObject(bucketName, filename, fileStream, stats.size, (e, objInfo) => {
          if (e) return reject(e);
          return resolve(objInfo);
        });
      });
    });
  },
  getObject(filename) {
    return new Promise((resolve, reject) => {
      this.client.getObject(bucketName, filename, (err, dataStream) => {
        if (err) return reject(err);
        const bufs = [];
        dataStream.on('data', (chunk) => {
          bufs.push(chunk);
        });
        dataStream.on('end', () => {
          resolve(Buffer.concat(bufs));
        });
        dataStream.on('error', (e) => {
          reject(e);
        });
        return null;
      });
    });
  },
};
