import { BASE_COIN, ALT_COIN, COIN_MAP, CURRENCY } from '../logic/types';

const BASE_API = 'https://api.coingecko.com/api/v3/';

type PriceResponse = {
  [key: string]: { [key: string]: number; last_updated_at: number };
};

export type CoinPrice = {
  price: number;
  date: Date;
};

export async function getCoinPrice(
  coin: BASE_COIN | ALT_COIN,
  currency: CURRENCY = 'usd',
): Promise<CoinPrice> {

  if (!COIN_MAP[coin]) {
    throw Error('Coin not added to API mapping')
  }

  const response: PriceResponse = await (
    await fetch(
      `${BASE_API}simple/price?ids=${COIN_MAP[coin]}&vs_currencies=${currency}&include_last_updated_at=true`,
    )
  ).json();

  return {
    price: response[COIN_MAP[coin]][currency],
    date: new Date(response[COIN_MAP[coin]].last_updated_at * 1000),
  };
}
