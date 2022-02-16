import {
  buyCoin,
  getLastFilledBuyOrder,
  getLastFilledSellOrder,
  getLastOpenBuyOrder,
  getOpenOrders,
  getWallet,
  sellCoin,
} from '../api/api-layer';
import { CoinPrice } from '../api/api-types';
import { getCoinPrice } from '../api/coingecko-api';
import { updateLastPrice } from '../db/db-helper';
import { pushBuyOrderToStack, stackPopOrder } from '../db/stack-helper';
import { getCoinBalance, getMinPriceOpenOrder } from './helpers';
import { ALT_COIN, Transaction } from './types';

const PROFIT = 0.5;
const QUANTITY = 0.5;

export async function runTradeEngine() {
  const coinPrice = await getCoinPrice('LUNA');
  const minPrice = getMinPriceOpenOrder(await getOpenOrders());
  const wallet = await getWallet();
  const busdBalance = getCoinBalance('BUSD', wallet);
  const lunaBalance = getCoinBalance('LUNA', wallet);

  if (!coinPrice || !minPrice) {
    return;
  }

  const lastOpenBuyOrder = await getLastOpenBuyOrder();

  // There is an open BUY order
  if (lastOpenBuyOrder) {
    console.log(`Pending BUY order id: ${lastOpenBuyOrder.id} price: ${lastOpenBuyOrder.price}`);
  } else {
    // Check if there is a SELL conterpart already by inspecting the stack
    const stackOrder = await stackPopOrder();

    // Create SELL order if stack it not empty
    if (stackOrder) {
      await sellCoin(stackOrder.price + PROFIT, QUANTITY);
    }

    // Get lastSellFilledOrder
    const lastFilledSellOrder = await getLastFilledSellOrder();
    const lastFilledBuyOrder = await getLastFilledBuyOrder();

    // Get coin price
    const coinPrice = await getCoinPrice('LUNA');

    if (!coinPrice) {
      console.log('No coin price available');
      return;
    }

    // Check current price with last SELL filled order
    if (lastFilledSellOrder && lastFilledBuyOrder) {

      console.log(`Current: ${coinPrice.price} Sell: ${lastFilledSellOrder.price} Buy: ${lastFilledBuyOrder.price} Balance: ${busdBalance}`);

      // If it is under Profit create new BUY order
      if (
        coinPrice.price <
        Math.min(
          lastFilledSellOrder.price - PROFIT,
          lastFilledBuyOrder.price - PROFIT,
        )
      ) {
        const sellResult = await buyCoin(
          lastFilledSellOrder.price - PROFIT,
          QUANTITY,
        );
        // And save it to the stack
        if (sellResult) {
          await pushBuyOrderToStack(sellResult.id, sellResult.price);
        }
      }
    }
  }

  await updateLastPrice('LUNA', coinPrice);
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
