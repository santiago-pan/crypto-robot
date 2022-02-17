import {
  getLastFilledBuyOrder,
  getLastFilledSellOrder,
  getLastOpenBuyOrder,
  getOpenOrders,
  getWallet,
} from '../api/api-layer';
import {
  bnbAccount,
  bnbAllOrders,
  bnbNewOrder,
  bnbOpenOrders,
} from '../api/binance-api';

describe('binance api test', () => {
  it.skip('should get all binance open orders', async () => {
    const orders = await bnbOpenOrders();
    console.log(orders);
  });
  it.skip('should fetch account information', async () => {
    const wallet = await bnbAccount();
    console.log(JSON.stringify(wallet, null, 4));
  });
  it.skip('should create a new order', async () => {
    const newOrderResponse = await bnbNewOrder('LUNABUSD', 'BUY', 'LIMIT', {
      price: 40,
      quantity: 1,
      timeInForce: 'GTC',
    });
    console.log(newOrderResponse)
  });
  it('should get all orders', async () => {
    const allOrders = await bnbAllOrders('LUNABUSD', { limit: 20 });
    // await saveBinanceOrders(allOrders)
    console.log(allOrders);
  });
});

describe('layer api test', () => {
  it.skip('should get all open orders', async () => {
    const openOrders = await getOpenOrders();
    console.log(openOrders);
  });
  it.skip('should get wallet info', async () => {
    const wallet = await getWallet();
    console.log(wallet);
  });
  it.skip('should get latest open BUY order', async () => {
    const lastBuyOrder = await getLastOpenBuyOrder();
    console.log(lastBuyOrder);
  });
  it.skip('should get latest filled BUY order', async () => {
    const lastBuyOrder = await getLastFilledBuyOrder();
    console.log(lastBuyOrder);
  });
  it.skip('should get latest filled SELL order', async () => {
    const lastBuyOrder = await getLastFilledSellOrder();
    console.log(lastBuyOrder);
  });
});