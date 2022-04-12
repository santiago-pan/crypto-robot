import axios from 'axios';
import { ALT_COIN, BASE_COIN, COIN_MAP, CURRENCY } from '../logic/types';
import { CoinGeckoPricesHistory, CoinPrice } from './api-types';

export const BASE_API = 'https://api.coingecko.com/api/v3/';

type PriceResponse = {
  [key: string]: { [key: string]: number; last_updated_at: number };
};

export async function getCoinPrice(
  coin: BASE_COIN | ALT_COIN,
  currency: CURRENCY = 'usd',
): Promise<CoinPrice> {
  if (!COIN_MAP[coin]) {
    throw Error('Coin not added to API mapping');
  }

  const response: PriceResponse = (await (
    await axios.get(
      `${BASE_API}simple/price?ids=${COIN_MAP[coin]}&vs_currencies=${currency}&include_last_updated_at=true`,
    )
  ).data) as PriceResponse;

  return {
    price: response[COIN_MAP[coin]][currency],
    date: response[COIN_MAP[coin]].last_updated_at * 1000,
  };
}

export async function setBuyOp(coin: ALT_COIN, ammount: number, price: number) {
  // Binance API
  console.log(`BUY order, coin ${coin}, units ${ammount}, price ${price} `);
}

export async function setSellOp(
  coin: ALT_COIN,
  ammount: number,
  price: number,
) {
  // Binance API
  console.log(`SELL order, coin ${coin}, units ${ammount}, price ${price} `);
}

/**
 * @param coin  Coin to fetch price history from
 * @param minutesAgo Number of hours back from present time
 */
export async function getCoinPriceHistory(
  coin: ALT_COIN,
  minutesAgo: number,
): Promise<CoinGeckoPricesHistory> {
  const to = Math.floor(new Date().getTime() / 1000);
  const from = to - minutesAgo * 60;
  const url = `${BASE_API}coins/${COIN_MAP[coin]}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  const response = await axios.get(url);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  return response.data as CoinGeckoPricesHistory;
}

export async function getCoinLastPrice(coin: ALT_COIN): Promise<CoinPrice | null> {
  const prices = await getCoinPriceHistory(coin, 10); // API offers values every 5 minutes
  if (prices && prices.prices.length > 0) {
    return {
      date: prices.prices[prices.prices.length - 1][0],
      price: prices.prices[prices.prices.length - 1][1]
    };
  }
  return null
}
