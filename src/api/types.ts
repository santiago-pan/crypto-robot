import { Method } from "axios";

export type RequestConfig = {
  baseURL: string;
  url: string;
  apiKey: string;
  method: Method
}

export type QueryStringParams = {
  [key:string]:string
}

export type TradeSide = 'SELL' | 'BUY'

export type TradeType = 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER';

export type TradeNewOrderOptions = {
  quantity?: number,
  price?: number
}
export type TradeOpenOrdersOptions = {
  symbol?: string
}

export interface IJsonResponse {
  data: {
    prices: [[number, number], [number, number]];
  };
}
export interface IResponse {
  json: () => IJsonResponse;
}
