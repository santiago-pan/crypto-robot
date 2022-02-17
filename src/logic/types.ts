import { ORDER_SIDE, SYMBOL } from '../api/api-types';

export const COIN_MAP: { [key: string]: string } = {
  ADA: 'cardano',
  BNB: 'binancecoin',
  BTC: 'bitcoin',
  BTT: 'bittorrent-2',
  DOT: 'polkadot',
  LTC: 'litecoin',
  LINK: 'chainlink',
  LUNA: 'terra-luna',
  UNI: 'unicorn-token',
  VET: 'vechain',
};

export type CURRENCY = 'usd' | 'eur';

export type ALT_COIN =
  | 'ADA'
  | 'BNB'
  | 'BUSD'
  | 'BTT'
  | 'DOGE'
  | 'DOT'
  | 'ETH'
  | 'IOST'
  | 'LTC'
  | 'LINK'
  | 'LUNA'
  | 'OGN'
  | 'PERL'
  | 'UNI'
  | 'VET'
  | 'XRP';
export type BASE_COIN = 'BNB' | 'BTC' | 'ETH' | 'BUSD';

export type COINS = BASE_COIN | ALT_COIN;

export type TRANSACTION_TYPE = 'BUY' | 'SELL';

export type Transaction = {
  date: Date;
  type: TRANSACTION_TYPE;
  altCoin: ALT_COIN;
  baseCoin: BASE_COIN;
  amount: number;
  price: number;
  fee: number;
  coinFee: BASE_COIN | ALT_COIN;
};

export type Asset = {
  coin: BASE_COIN | ALT_COIN;
  total: number;
  inOrder: number;
};

export type OpenOrder = {
  id: number;
  symbol: SYMBOL;
  price: number;
  quantity: number;
  side: ORDER_SIDE;
  date: Date;
  timestampCreated: number;
  timestampUpdated: number;
};

export type Balance = {
  coin: ALT_COIN;
  free: number;
  locked: number;
};

export type Wallet = {
  balances: ReadonlyArray<Balance>;
};

export type LoopStatus =
  | {
      status: 'ok';
    }
  | {
      status: 'error';
      msg: string;
    };
