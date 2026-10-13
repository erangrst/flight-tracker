import axios from 'axios';

export const proxyClient = axios.create({
  baseURL: 'http://localhost:5088/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
