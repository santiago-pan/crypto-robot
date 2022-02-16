import crypto from 'crypto';
import axios, { AxiosRequestConfig, Method } from "axios";
import constants from "./constants";
import { QueryStringParams, RequestConfig } from "./api-types";

export const validateRequiredParameters = (paramObject: any) => {
  if (!paramObject || isEmptyValue(paramObject)) {
    throw new Error();
  }
  const emptyParams: any[] = [];
  Object.keys(paramObject).forEach((param) => {
    if (isEmptyValue(paramObject[param])) {
      emptyParams.push(param);
    }
  });
  if (emptyParams.length) {
    throw new Error(JSON.stringify(emptyParams));
  }
};

const isEmptyValue = (input: any) => {
  return (
    (!input && input !== false && input !== 0) ||
    ((typeof input === 'string' || input instanceof String) &&
      /^\s+$/.test(input as string)) ||
    (input instanceof Object && !Object.keys(input).length) ||
    (Array.isArray(input) && !input.length)
  );
};

const removeEmptyValue = (obj: any) => {
  if (!(obj instanceof Object)) return {};
  Object.keys(obj).forEach((key) => isEmptyValue(obj[key]) && delete obj[key]);
  return obj;
};

const buildQueryString = (params: QueryStringParams) => {
  if (!params) return '';
  return Object.entries(params).map(stringifyKeyValuePair).join('&');
};

const stringifyKeyValuePair = ([key, value]: [key: string, value: string]) => {
  const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value;
  return `${key}=${encodeURIComponent(valueString)}`;
};

export function signRequest(
  method: Method,
  path: string,
  params = {}
) {

  const apiSecret = process.env.API_SECRET as string
  const apiKey = process.env.API_KEY as string

  params = removeEmptyValue(params);
  const timestamp = Date.now().toString();
  const queryString = buildQueryString({ ...params, timestamp });
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(queryString)
    .digest('hex');

  return createRequest({
    method: method,
    baseURL: 'https://api.binance.com',
    url: `${path}?${queryString}&signature=${signature}`,
    apiKey,
  });
}

const getRequestInstance = (config: AxiosRequestConfig) => {
  return axios.create({
    ...config,
  });
};

const createRequest = (config: RequestConfig) => {
  const { baseURL, apiKey, method, url } = config;
  return getRequestInstance({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': apiKey,
      'User-Agent': `${constants.appName}/${constants.appVersion}`,
    },
  }).request({
    method,
    url,
  });
};
