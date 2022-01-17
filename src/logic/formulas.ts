import { CoinPrice, getCoinPrice } from '../api/api';
import { ALT_COIN, Transaction } from './types';

export function runTradeEngine() {
  // Gather open SELL operation/s (binance/db)
  // Gather open BUY operation/s (binance/db)
  // Gather available liquidity (binance/db)
  // Gather coin/s current price (coingecko)
  // Gather coin/s history price (max,min)

  // Run SELL orders logic
  // - currentPrice over lowers BUY order
  // - currentPrice over local max price
  // - price diff step (orders price separation)
  // - time diff gap (orders time difference)

  // Run BUY orders logic
  // - currentPrice over higher SELL order
  // - currentPrice over local min price
  // - price diff step (orders price separation)
  // - time diff gap (orders time difference)
}

export const getTransactionValueBTC = (t: Transaction): number =>
  t.amount * t.price;

export const getTransactionsProfitBTC = (
  sellTransaction: Transaction,
  buyTransaction: Transaction,
): number => {
  if (sellTransaction.baseCoin != buyTransaction.baseCoin) {
    throw Error('Transactions do not have same base coin');
  }
  if (sellTransaction.altCoin != buyTransaction.altCoin) {
    throw Error('Transactions do not have same alt coin');
  }
  if (sellTransaction.type !== 'SELL') {
    throw Error('Sell transaction is not of type SELL');
  }
  if (buyTransaction.type !== 'BUY') {
    throw Error('Buy transaction is not of type BUY');
  }

  const priceDifference = sellTransaction.price - buyTransaction.price;
  return sellTransaction.amount * priceDifference;
};

export const getTransactionPair = (t: Transaction) =>
  `${t.altCoin}/${t.baseCoin}`;

export async function getSellProfitBTC(
  lastTransaction: Transaction,
  coin: ALT_COIN,
) {
  if (lastTransaction.altCoin !== coin) {
    throw Error('Alt coins do not match');
  }
  if (lastTransaction.type !== 'BUY') {
    throw Error('Last trasnsaction must be BUY type');
  }
  const coinPrice = await getCoinPrice(coin);
  const btcPrice = await getCoinPrice('BTC');
  const coinBTCPrice = getAltCoinBTCPrice(btcPrice, coinPrice);
  return (coinBTCPrice.price - lastTransaction.price) * lastTransaction.amount
}

export function getAltCoinBTCPrice(
  btcUSDPrice: CoinPrice,
  altCoinUSD: CoinPrice,
): CoinPrice {
  return {
    price: altCoinUSD.price / btcUSDPrice.price,
    date: altCoinUSD.date,
  };
}