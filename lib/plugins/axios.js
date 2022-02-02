import axios from 'axios';
import { baseUrl } from '../config';

export const ax = axios.create({
  baseURL: baseUrl,
});
