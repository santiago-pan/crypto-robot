import {
  buyCoin,
  getLastFilledBuyOrder,
  getLastFilledSellOrder,
  getLastOpenBuyOrder,
  getWallet,
  sellCoin,
} from '../api/api-layer';
import { CoinPrice } from '../api/api-types';
import { getLunaPrice } from '../api/coincap';
import { getCoinPrice } from '../api/coingecko-api';
import { updateLastPrice } from '../db/db-helper';
import { log } from '../db/logger';
import { pushBuyOrderToStack, stackPopOrder } from '../db/stack-helper';
import { getCoinBalance } from './helpers';
import { ALT_COIN, LoopStatus, OpenOrder, Transaction } from './types';

const PROFIT = 0.5;
const QUANTITY = 1;

export async function callLoop() {
  let test = true;
  if (process.env.MODE === 'PRODUCTION') {
    test = false;
  }
  // const coinPrice = await getCoinPrice('LUNA');
  const coinPrice = await getLunaPrice();
  const wallet = await getWallet();
  const busdBalance = getCoinBalance('BUSD', wallet);
  const lastOpenBuyOrder = await getLastOpenBuyOrder('LUNABUSD');

  if (lastOpenBuyOrder) {
    console.log(
      `Pending BUY order id: ${lastOpenBuyOrder.id} price: ${lastOpenBuyOrder.price}`,
    );
    return;
  }

  const lastFilledSellOrder = await getLastFilledSellOrder();
  const lastFilledBuyOrder = await getLastFilledBuyOrder();

  // Check current price with last SELL filled order
  if (!lastFilledBuyOrder || !lastFilledSellOrder) {
    log('No last buy or sell orders available');
    return;
  }

  const referencePrice =
    lastFilledBuyOrder.timestampUpdated > lastFilledSellOrder.timestampUpdated
      ? lastFilledBuyOrder.price
      : lastFilledSellOrder.price;

  const date = new Date();
  console.log(
    `${date.toISOString().replace('T', ' ').replace('Z', '').slice(0, -4)} [${
      coinPrice.price
    }] [Sold ${lastFilledSellOrder.price}, Bought ${
      lastFilledBuyOrder.price
    }, Last ${referencePrice} Balance ${Math.round(busdBalance)}]`,
  );

  const result = await loop(
    coinPrice,
    lastFilledSellOrder,
    lastFilledBuyOrder,
    busdBalance,
    test,
  );

  if (result.status === 'error') {
    log(`Error: ${result.msg}`);
  }

  await updateLastPrice('LUNA', coinPrice);
}

export async function loop(
  coinPrice: CoinPrice,
  lastFilledSellOrder: OpenOrder,
  lastFilledBuyOrder: OpenOrder,
  busdBalance: number,
  test = true,
): Promise<LoopStatus> {
  // Check if there is a SELL conterpart already by inspecting the stack
  const stackOrder = await stackPopOrder();

  // Create SELL order if stack it not empty
  if (stackOrder) {
    await sellCoin(lastFilledBuyOrder.price + PROFIT, QUANTITY, test);
    return { status: 'ok' };
  }

  const referencePrice =
    lastFilledBuyOrder.timestampUpdated > lastFilledSellOrder.timestampUpdated
      ? lastFilledBuyOrder.price
      : lastFilledSellOrder.price;

  if (coinPrice.price > referencePrice - PROFIT) {
    return { status: 'ok' };
  }

  if (busdBalance < coinPrice.price * 1.5) {
    return { status: 'error', msg: 'Not enough balance to buy' };
  }

  const sellResult = await buyCoin(coinPrice.price, QUANTITY, test);

  if (!sellResult) {
    return { status: 'error', msg: 'Error buying coin' };
  }

  // Save it to the stack
  await pushBuyOrderToStack(sellResult.id, sellResult.price);

  return { status: 'ok' };
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
  return (coinBTCPrice.price - lastTransaction.price) * lastTransaction.amount;
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

export function getInvestQuantity(price: number) {
  const maxPrice = 90; // 1
  const minPrice = 40; // 2
  const step = 1 / (maxPrice - minPrice);

  if (price >= maxPrice) {
    return 1;
  }
  if (price <= minPrice) {
    return 2;
  }
  return Math.round((1 + (maxPrice - price) * step) * 100) / 100;
}
