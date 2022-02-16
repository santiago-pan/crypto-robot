import { Method } from 'axios';

export type RequestConfig = {
  baseURL: string;
  url: string;
  apiKey: string;
  method: Method;
};

//********* CoinGecko API *****/

export interface CoinGeckoPricesHistory {
  prices: ReadonlyArray<[number, number]>;
  market_caps: ReadonlyArray<[number, number]>;
  total_volumes: ReadonlyArray<[number, number]>;
}

export interface CoinGeckoMockResponse {
  ok: boolean;
  json: () => CoinGeckoPricesHistory;
}

export type CoinPrice = {
  date: number,
  price: number
}

//********* Binance API *****/

export type QueryStringParams = {
  [key: string]: string;
};

export type ORDER_SIDE = 'SELL' | 'BUY';

export type ORDER_TYPE =
  | 'LIMIT'
  | 'MARKET'
  | 'STOP_LOSS'
  | 'STOP_LOSS_LIMIT'
  | 'TAKE_PROFIT'
  | 'TAKE_PROFIT_LIMIT'
  | 'LIMIT_MAKER';

export type TradeNewOrderOptions = {
  quantity?: number;
  price?: number;
};
export type TradeOpenOrdersOptions = {
  symbol?: string;
};

export type SYMBOL = 'LUNABUSD' | 'ADABUSD';
type ORDER_STATUS = 'NEW' | 'FILLED' | 'CANCELED';
type TIME_IN_FORCE = 'GTC';

export type BinanceNewOrderOptions = {
  timeInForce: TIME_IN_FORCE;
  quantity: number;
  price: number;
};

export type BinanceOrder = {
  symbol: SYMBOL;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: string; // "101.84000000"
  origQty: string; // "1.00000000"
  executedQty: string;
  cummulativeQuoteQty: string;
  status: ORDER_STATUS;
  timeInForce: TIME_IN_FORCE;
  type: ORDER_TYPE;
  side: ORDER_SIDE;
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: true;
  origQuoteOrderQty: string;
};

export type WALLET_TYPE = 'SPOT' | 'MARGIN' | 'FUTURES';

export type BinanceBalance = {
  asset: string; // BTC, LUNA, ...
  free: string; // "10.00" Coin units, like 10 Lunas or 20 BNB
  locked: string; // "10.00" Coin units, like 10 Lunas or 20 BNB
};

export type BinanceAccount = {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: WALLET_TYPE;
  balances: ReadonlyArray<BinanceBalance>;
};

export type BinanceAllOrderOptions = {
  limit?: number
}