import type {
  AxiosStatic,
  AxiosRequestConfig,
  CancelTokenSource as TokenSource,
  CancelTokenStatic as TokenStatic,
} from 'axios';

import axios from 'axios';
import { Config } from 'Config';
import { STORAGE_KEYS } from 'helpers/constant';

axios.defaults.baseURL = Config.API.URL;

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.JWT);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
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
FixedHttp.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.JWT);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
