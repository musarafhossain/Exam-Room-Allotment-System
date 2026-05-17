import type {
  AxiosStatic,
  AxiosRequestConfig,
  CancelTokenSource as TokenSource,
  CancelTokenStatic as TokenStatic,
} from 'axios';

import axios from 'axios';
import { Config } from 'Config';

axios.defaults.baseURL = Config.API.URL;

axios.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  config.headers.Accept = 'application/json';
  return config;
});

export type CancelTokenSource = TokenSource;
export type CancelTokenStatic = TokenStatic;
export type RequestConfig = AxiosRequestConfig;
export type HttpModel = AxiosStatic;

export const Http: HttpModel = axios;
export const FixedHttp = axios.create();