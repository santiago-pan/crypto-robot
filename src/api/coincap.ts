import axios from 'axios';
import { CoinPrice } from './api-types';

export const LUNA_BASE_API = 'https://api.coincap.io/v2/assets/terra-luna';
export const ADA_BASE_API = 'https://api.coincap.io/v2/assets/cardano';

type PriceResponse = {
  data: {
    priceUsd: string;
  };
  timestamp: number;
};

export async function getLunaPrice(): Promise<CoinPrice> {
  const response: PriceResponse = (await (
    await axios.get(LUNA_BASE_API)
  ).data) as PriceResponse;

  return {
    price: parseFloat(parseFloat(response.data.priceUsd).toFixed(2)),
    date: response.timestamp,
  };
}

export async function getAdaPrice(): Promise<CoinPrice> {
  const response: PriceResponse = (await (
    await axios.get(ADA_BASE_API)
  ).data) as PriceResponse;

  return {
    price: parseFloat(parseFloat(response.data.priceUsd).toFixed(2)),
    date: response.timestamp,
  };
}