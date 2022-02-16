import { ALT_COIN } from '../logic/types';

export type DBPrices = Record<
  ALT_COIN,
  {
    maxPrice: number;
    minPrice: number;
    lastPrice: number;
    history: { date: number; price: number }[];
  }
>;
