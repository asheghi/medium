import axios from 'axios';
import { baseUrl } from '../config';

export const ax = axios.create({
  baseURL: baseUrl,
});

let csrfToken;
let csrfRequest;
const unsafeMethods = new Set(['post', 'put', 'patch', 'delete']);

async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = ax.get('auth/csrf').then(({ data }) => {
      csrfToken = data.csrfToken;
      return csrfToken;
    }).finally(() => {
      csrfRequest = null;
    });
  }
  return csrfRequest;
}

ax.interceptors.request.use(async (config) => {
  if (!unsafeMethods.has(config.method)) return config;
  const token = await getCsrfToken();
  config.headers.set('X-CSRF-Token', token);
  return config;
});
