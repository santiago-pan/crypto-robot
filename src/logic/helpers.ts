import { ALT_COIN, OpenOrder, Wallet } from './types';

export function getMinPriceOpenOrder(
  orders: ReadonlyArray<OpenOrder>,
): OpenOrder | null {
  if (orders.length === 0) {
    return null;
  }
  if (orders.length === 1) {
    return orders[0];
  }
  const sorted = [...orders].sort((a, b) => (a.price > b.price ? 1 : -1));
  return sorted[0];
}

export function getMaxPriceOpenOrder(
  orders: ReadonlyArray<OpenOrder>,
): OpenOrder | null {
  if (orders.length === 0) {
    return null;
  }
  if (orders.length === 1) {
    return orders[0];
  }
  const sorted = [...orders].sort((a, b) => (a.price > b.price ? -1 : 1));
  return sorted[0];
}

export function getCoinBalance(coin: ALT_COIN, wallet: Wallet): number {
  return wallet.balances
    .filter((b) => b.coin === coin)
    .map((b) => b.free)
    .reduce((prev, current) => prev + current, 0);
}
