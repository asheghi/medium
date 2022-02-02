import debug from 'debug';
import { mediaBaseUrl } from './config.js';

export function parseAxiosError(error) {
  let msg = error.message || 'something_went_wrong';
  if (error.response) {
    const { headers, status, data } = error.response;
    if (data && data.errors && data.errors.length) {
      const [first] = data.errors;
      msg = first;
    }
    return {
      data,
      status,
      headers,
      msg,
    };
  } if (error.request) {
    return { req: error.request, msg };
  }
  return { msg };
}

export function getDebug(name, type) {
  let namespace = `app:${name}`;
  if (type) {
    namespace += `:${type}`;
  }
  return debug(namespace);
}

export function getImageSrc(image) {
  if (!(image && image.data)) return null;
  console.log(image);
  return mediaBaseUrl + image.data.attributes.url;
}
