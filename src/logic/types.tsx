export const COIN_MAP: { [key: string]: string } = {
  ADA: 'cardano',
  BNB: 'binancecoin',
  BTC: 'bitcoin',
  BTT: 'bittorrent-2',
  DOT: 'polkadot',
  LTC: 'litecoin',
  LINK: 'chainlink',
  UNI: 'unicorn-token',
  VET: 'vechain',
};

export type CURRENCY = 'usd' | 'eur';

export type ALT_COIN =
  | 'ADA'
  | 'BNB'
  | 'BTT'
  | 'DOGE'
  | 'DOT'
  | 'ETH'
  | 'IOST'
  | 'LTC'
  | 'LINK'
  | 'OGN'
  | 'PERL'
  | 'UNI'
  | 'VET'
  | 'XRP';
export type BASE_COIN = 'BNB' | 'BTC' | 'ETH' | 'BUSD';

export type COINS = BASE_COIN | ALT_COIN

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
}