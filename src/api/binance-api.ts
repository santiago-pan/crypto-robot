import { log } from '../db/logger';
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
} from './api-types';
import { signRequest, validateRequiredParameters } from './binance-helper';

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
    log(response.statusText);
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
    log(response.statusText);
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
      orderId: 558752400,
    }),
  );

  if (response.status != 200) {
    log(response.statusText);
    throw Error(response.statusText);
  }

  return response.data;
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
    log(response.statusText);
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
