const Minio = require('minio');
const fs = require('fs');

const bucketName = process.env.MINIO_BUCKET_NAME;

module.exports.ObjectStorage = {
  client: new Minio.Client({
    endPoint: process.env.MINIO_END_POINT_URL,
    port: +process.env.MINIO_PORT,
    useSSL: false, // process.env.MINIO_SSL !== 'false',
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
  }),
  listObjects() {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (e) {
        reject(e);
      }
    });
  },
  uploadFile(filePath, filename, metadata = {}) {
    return new Promise((resolve, reject) => {
      try {
        const fileStream = fs.createReadStream(filePath);
        fs.stat(filePath, (err, stats) => {
          if (err) return reject(err);
          const cb = (e, objInfo) => {
            if (e) return reject(e);
            return resolve(objInfo);
          };
          return this.client.putObject(bucketName, filename, fileStream, stats.size, metadata, cb);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  getObject(filename) {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (e) {
        reject(e);
      }
    });
  },
};
