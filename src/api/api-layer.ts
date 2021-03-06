import { log } from '../db/logger';
import { ALT_COIN, Balance, OpenOrder, Wallet } from '../logic/types';
import { SYMBOL } from './api-types';
import {
  bnbAccount,
  bnbAllOrders,
  bnbNewOrder,
  bnbOpenOrders,
} from './binance-api';

export async function getWallet(): Promise<Wallet> {
  const wallet = await bnbAccount();
  return {
    balances: wallet.balances.map<Balance>((b) => ({
      coin: b.asset as ALT_COIN,
      free: parseFloat(b.free),
      locked: parseFloat(b.locked),
    })),
  };
}

export async function getOpenOrders(): Promise<ReadonlyArray<OpenOrder>> {
  const bnbOrders = await bnbOpenOrders();
  return bnbOrders.map<OpenOrder>((b) => ({
    id: b.orderId,
    date: new Date(b.time),
    price: parseFloat(b.price),
    quantity: parseFloat(b.origQty),
    side: b.side,
    symbol: b.symbol,
    timestampCreated: b.time,
    timestampUpdated: b.updateTime,
  }));
}

export async function getLastOpenBuyOrder(
  symbol: SYMBOL,
): Promise<OpenOrder | null> {
  const bnbOrders = await bnbOpenOrders();
  const buyOrders = bnbOrders.filter(
    (b) => b.side === 'BUY' && b.symbol === symbol,
  );
  if (buyOrders.length > 0) {
    const b = buyOrders[buyOrders.length - 1];
    return {
      id: b.orderId,
      date: new Date(b.time),
      price: parseFloat(b.price),
      quantity: parseFloat(b.origQty),
      side: b.side,
      symbol: b.symbol,
      timestampCreated: b.time,
      timestampUpdated: b.updateTime,
    };
  }
  return null;
}

export async function getLastFilledBuyOrder(): Promise<OpenOrder | null> {
  const bnbOrders = await bnbAllOrders('ADABUSD', {});
  const buyOrders = [...bnbOrders]
    .sort((a, b) => (a.updateTime > b.updateTime ? 1 : -1))
    .filter((b) => b.side === 'BUY')
    .filter((b) => b.status === 'FILLED');
  if (buyOrders.length > 0) {
    const b = buyOrders[buyOrders.length - 1];
    return {
      id: b.orderId,
      date: new Date(b.time),
      price: parseFloat(b.cummulativeQuoteQty) / parseFloat(b.executedQty),
      quantity: parseFloat(b.executedQty),
      side: b.side,
      symbol: b.symbol,
      timestampCreated: b.time,
      timestampUpdated: b.updateTime,
    };
  }
  return null;
}

export async function getLastFilledSellOrder(): Promise<OpenOrder | null> {
  const bnbOrders = await bnbAllOrders('ADABUSD', {});
  const buyOrders = [...bnbOrders]
    .sort((a, b) => (a.updateTime > b.updateTime ? 1 : -1))
    .filter((b) => b.side === 'SELL')
    .filter((b) => b.status === 'FILLED');
  if (buyOrders.length > 0) {
    const b = buyOrders[buyOrders.length - 1];
    return {
      id: b.orderId,
      date: new Date(b.time),
      price: parseFloat(b.cummulativeQuoteQty) / parseFloat(b.executedQty),
      quantity: parseFloat(b.executedQty),
      side: b.side,
      symbol: b.symbol,
      timestampCreated: b.time,
      timestampUpdated: b.updateTime,
    };
  }
  return null;
}

export async function buyCoin(
  price: number,
  quantity: number,
  test = true,
): Promise<{ id: number; price: number } | null> {
  if (test) {
    console.log(`TEST MODE: Buy order at price: ${price} of ${quantity} coin`);
    return {
      id: 1,
      price,
    };
  }

  const newOrderResponse = await bnbNewOrder('ADABUSD', 'BUY', 'LIMIT', {
    price,
    quantity,
    timeInForce: 'GTC',
  });
  if (!newOrderResponse) {
    return null;
  }
  console.log(
    `PRODUCTION MODE: Buy order at price: ${price} of ${quantity} coin`,
  );
  log(`PRODUCTION MODE: Buy order at price: ${price} of ${quantity} coin`);
  return {
    id: newOrderResponse.orderId,
    price: parseFloat(newOrderResponse.price),
  };
}

export async function sellCoin(price: number, quantity: number, test = true) {
  if (test) {
    console.log(`TEST MODE: Sell order at price: ${price} of ${quantity} coin`);
    return {
      id: 1,
      price,
    };
  }

  const newOrderResponse = await bnbNewOrder('ADABUSD', 'SELL', 'LIMIT', {
    price,
    quantity,
    timeInForce: 'GTC',
  });
  if (!newOrderResponse) {
    return null;
  }
  console.log(
    `PRODUCTION MODE: Sell order at price: ${price} of ${quantity} coin`,
  );
  log(`PRODUCTION MODE: Sell order at price: ${price} of ${quantity} coin`);
  return {
    id: newOrderResponse.orderId,
    price: parseFloat(newOrderResponse.price),
  };
}
