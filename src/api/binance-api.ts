import {
  BinanceAccount,
  BinanceAllOrderOptions,
  BinanceNewOrderOptions,
  BinanceOrder,
  ORDER_SIDE,
  ORDER_TYPE,
  SYMBOL,
  TradeNewOrderOptions,
  TradeOpenOrdersOptions,
  WALLET_TYPE,
} from './api-types';
import { signRequest, validateRequiredParameters } from './binance-helper';

/**
 * Test New Order (TRADE)<br>
 *
 * POST /api/v3/order/test<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#test-new-order-trade}
 *
 * @param {string} symbol
 * @param {string} side
 * @param {string} type
 * @param {object} [options]
 * @param {string} [options.timeInForce]
 * @param {number} [options.quantity]
 * @param {number} [options.quoteOrderQty]
 * @param {number} [options.price]
 * @param {string} [options.newClientOrderId] - A unique id among open orders. Automatically generated if not sent.
 * @param {number} [options.stopPrice] - Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders.
 * @param {number} [options.icebergQty] - Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order.
 * @param {string} [options.newOrderRespType] - Set the response JSON. ACK, RESULT, or FULL;
 *    MARKET and LIMIT order types default to FULL, all other orders default to ACK.
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbNewOrderTest(
  symbol: SYMBOL,
  side: ORDER_SIDE,
  type: ORDER_TYPE,
  options: BinanceNewOrderOptions,
) {
  validateRequiredParameters({ symbol, side, type });

  return signRequest(
    'POST',
    '/api/v3/order/test',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
      side: side.toUpperCase(),
      type: type.toUpperCase(),
    }),
  );
}

/**
 * New Order (TRADE)<br>
 *
 * POST /api/v3/order<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
 *
 * @param {string} symbol
 * @param {string} side
 * @param {string} type
 * @param {object} [options]
 * @param {string} [options.timeInForce]
 * @param {number} [options.quantity]
 * @param {number} [options.quoteOrderQty]
 * @param {number} [options.price]
 * @param {string} [options.newClientOrderId]
 * @param {number} [options.stopPrice]
 * @param {number} [options.icebergQty]
 * @param {string} [options.newOrderRespType]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export async function bnbNewOrder(
  symbol: SYMBOL,
  side: ORDER_SIDE,
  type: ORDER_TYPE,
  options: BinanceNewOrderOptions,
): Promise<BinanceOrder | null> {
  validateRequiredParameters({ symbol, side, type });

  const response = await signRequest(
    'POST',
    '/api/v3/order',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
      side: side.toUpperCase(),
      type: type.toUpperCase(),
    }),
  );

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

/**
 * Cancel Order (TRADE)<br>
 *
 * DELETE /api/v3/order<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#cancel-order-trade}
 *
 * @param {string} symbol
 * @param {object} [options]
 * @param {number} [options.orderId]
 * @param {string} [options.origClientOrderId]
 * @param {string} [options.newClientOrderId]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbCancelOrder(
  symbol: SYMBOL,
  options: TradeNewOrderOptions = {},
) {
  validateRequiredParameters({ symbol });

  return signRequest(
    'DELETE',
    '/api/v3/order',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
    }),
  );
}

/**
 * Cancel all Open Orders on a Symbol (TRADE)<br>
 *
 * DELETE /api/v3/openOrders<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#cancel-all-open-orders-on-a-symbol-trade}
 * @param {string} symbol
 * @param {object} [options]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbCancelOpenOrders(
  symbol: string,
  options: TradeNewOrderOptions = {},
) {
  validateRequiredParameters({ symbol });

  return signRequest(
    'DELETE',
    '/api/v3/openOrders',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
    }),
  );
}

/**
 * Query Order (USER_DATA)<br>
 *
 * GET /api/v3/order<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#query-order-user_data}
 *
 * @param {string} symbol
 * @param {object} [options]
 * @param {number} [options.orderId]
 * @param {string} [options.origClientOrderId]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbGetOrder(
  symbol: string,
  options: TradeNewOrderOptions = {},
) {
  validateRequiredParameters({ symbol });
  return signRequest(
    'GET',
    '/api/v3/order',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
    }),
  );
}

/**
 * Current Open Orders
 *
 * GET /api/v3/openOrders
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#current-open-orders-user_data}
 *
 * @param {object} [options]
 * @param {string} [options.symbol]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export async function bnbOpenOrders(
  options: TradeOpenOrdersOptions = {},
): Promise<ReadonlyArray<BinanceOrder>> {
  const response = await signRequest('GET', '/api/v3/openOrders', options);

  if (response.status != 200) {
    throw Error(response.statusText);
  }

  return response.data;
}

/**
 * All Orders (USER_DATA)<br>
 *
 * GET /api/v3/allOrders<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#all-orders-user_data}
 *
 * @param {string} symbol
 * @param {object} [options]
 * @param {number} [options.orderId]
 * @param {number} [options.startTime]
 * @param {number} [options.endTime]
 * @param {number} [options.limit]
 * @param {string} [options.recvWindow] - The value cannot be greater than 60000
 */
export async function bnbAllOrders(
  symbol: string,
  options: BinanceAllOrderOptions = {},
): Promise<ReadonlyArray<BinanceOrder>> {
  validateRequiredParameters({ symbol });
  const response = await signRequest(
    'GET',
    '/api/v3/allOrders',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
      orderId: 276590520
    }),
  );

  if (response.status != 200) {
    throw Error(response.statusText);
  }

  return response.data;
}

/**
 * New OCO (TRADE)<br>
 *
 * POST /api/v3/order/oco<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#new-oco-trade}
 *
 * @param {string} symbol
 * @param {string} side
 * @param {number} quantity
 * @param {number} price
 * @param {number} stopPrice
 * @param {object} [options]
 * @param {string} [options.listClientOrderId]
 * @param {string} [options.limitClientOrderId]
 * @param {number} [options.limitIcebergQty]
 * @param {string} [options.stopClientOrderId]
 * @param {number} [options.stopLimitPrice]
 * @param {number} [options.stopIcebergQty]
 * @param {string} [options.stopLimitTimeInForce]
 * @param {string} [options.newOrderRespType]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbNewOCOOrder(
  symbol: SYMBOL,
  side: ORDER_SIDE,
  quantity: string,
  price: string,
  stopPrice: string,
  options: TradeNewOrderOptions = {},
) {
  validateRequiredParameters({ symbol, side, quantity, price, stopPrice });

  return signRequest(
    'POST',
    '/api/v3/order/oco',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
      side: side.toUpperCase(),
      quantity,
      price,
      stopPrice,
    }),
  );
}

/**
 * Cancel OCO (TRADE)<br>
 *
 * DELETE /api/v3/orderList<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#cancel-oco-trade}
 *
 * @param {string} symbol
 * @param {object} [options]
 * @param {number} [options.orderListId]
 * @param {string} [options.listClientOrderId]
 * @param {string} [options.newClientOrderId]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbCancelOCOOrder(
  symbol: string,
  options: TradeNewOrderOptions = {},
) {
  validateRequiredParameters({ symbol });

  return signRequest(
    'DELETE',
    '/api/v3/orderList',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
    }),
  );
}

/**
 * Query OCO (USER_DATA)<br>
 *
 * GET /api/v3/orderList<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#query-oco-user_data}
 *
 * @param {object} [options]
 * @param {number} [options.orderListId]
 * @param {string} [options.origClientOrderId]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbGetOCOOrder(options: TradeNewOrderOptions) {
  return signRequest('GET', '/api/v3/orderList', options);
}

/**
 * Query all OCO (USER_DATA)<br>
 *
 * GET /api/v3/allOrderList<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#query-all-oco-user_data}
 *
 * @param {object} [options]
 * @param {number} [options.fromId]
 * @param {number} [options.startTime]
 * @param {number} [options.endTime]
 * @param {number} [options.limit]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbGetOCOOrders(options: TradeNewOrderOptions) {
  return signRequest('GET', '/api/v3/allOrderList', options);
}

/**
 * Query Open OCO (USER_DATA)<br>
 *
 * GET /api/v3/openOrderList<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#query-open-oco-user_data}
 *
 * @param {object} [options]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbGetOpenOCOOrders(options: TradeNewOrderOptions) {
  return signRequest('GET', '/api/v3/openOrderList', options);
}

/**
 * Account Information (USER_DATA)<br>
 *
 * GET /api/v3/account<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data}
 *
 * @param {object} [options]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export async function bnbAccount(options = {}): Promise<BinanceAccount> {
  const response = await signRequest('GET', '/api/v3/account', options);

  if (response.status != 200) {
    throw Error(response.statusText);
  }

  const data: BinanceAccount = response.data;
  return {
    ...data,
    balances: data.balances.filter(
      (b) => parseFloat(b.free) + parseFloat(b.locked) > 0,
    ),
  };
}

/**
 * Account Trade List (USER_DATA)<br>
 *
 * GET /api/v3/myTrades<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#account-trade-list-user_data}
 *
 * @param {string} symbol
 * @param {object} [options]
 * @param {number} [options.orderId] - This can only be used in combination with symbol.
 * @param {number} [options.startTime]
 * @param {number} [options.endTime]
 * @param {number} [options.fromId]
 * @param {number} [options.limit]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbMyTrades(
  symbol: string,
  options: TradeNewOrderOptions = {},
) {
  validateRequiredParameters({ symbol });

  return signRequest(
    'GET',
    '/api/v3/myTrades',
    Object.assign(options, {
      symbol: symbol.toUpperCase(),
    }),
  );
}

/**
 * Query Current Order Count Usage (TRADE)<br>
 *
 * GET /api/v3/rateLimit/order<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#query-current-order-count-usage-trade}
 *
 * @param {object} [options]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbOrderCount(options: TradeNewOrderOptions = {}) {
  return signRequest('GET', '/api/v3/rateLimit/order', options);
}

/**
 * All Coins' Information (USER_DATA)<br>
 *
 * GET /sapi/v1/capital/config/getall<br>
 *
 * Get information of coins (available for deposit and withdraw) for user.<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#all-coins-39-information-user_data}
 *
 * @param {object} [options]
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 *
 */
export function bnbCoinInfo(options = {}) {
  return signRequest('GET', '/sapi/v1/capital/config/getall', options);
}

/**
 * Daily Account Snapshot (USER_DATA)<br>
 *
 * GET /sapi/v1/accountSnapshot<br>
 *
 * {@link https://binance-docs.github.io/apidocs/spot/en/#daily-account-snapshot-user_data}
 *
 * @param {string} type - "SPOT", "MARGIN", "FUTURES"
 * @param {object} [options]
 * @param {number} [options.startTime]
 * @param {number} [options.endTime]
 * @param {number} [options.limit] - min 5, max 30, default 5
 * @param {number} [options.recvWindow] - The value cannot be greater than 60000
 */
export function bnbAccountSnapshot(type: WALLET_TYPE, options = {}) {
  validateRequiredParameters({ type });

  return signRequest(
    'GET',
    '/sapi/v1/accountSnapshot',
    Object.assign(options, {
      type: type.toUpperCase(),
    }),
  );
}
