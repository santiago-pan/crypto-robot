import { CoinPrice } from '../api/api-types';
import { getCoinPrice } from '../api/coingecko-api';
import {
  getLastOperation,
  getLastTransaction,
  loadTransactions,
  startDb,
} from '../db/db-helper';
import { pushBuyOrderToStack, stackPopOrder } from '../db/stack-helper';
import {
  getAltCoinBTCPrice,
  getSellProfitBTC,
  getTransactionPair,
  getTransactionsProfitBTC,
  getTransactionValueBTC,
  loop,
} from '../logic/formulas';
import { OpenOrder, Transaction } from '../logic/types';
import { btcData } from '../static/data';

describe('Formulas tests', () => {
  it('should get transaction value', () => {
    expect(getTransactionValueBTC(transaction)).toBe(0.00207414);
  });

  it('should get transaction pair', () => {
    expect(getTransactionPair(transaction)).toBe('LTC/BTC');
  });

  it('should get transactions value difference', () => {
    expect(getTransactionsProfitBTC(tSell, tBuy)).toBe(0.00013800000000000005);
  });

  it('should return exception', () => {
    try {
      getTransactionsProfitBTC(tBuy, tBuy);
    } catch (err: any) {
      expect(err.toString()).toBe(
        'Error: Sell transaction is not of type SELL',
      );
    }
  });

  it('should return exception', () => {
    try {
      getTransactionsProfitBTC(transaction, tBuy);
    } catch (err: any) {
      expect(err.toString()).toBe(
        'Error: Transactions do not have same alt coin',
      );
    }
  });

  it.skip('fetch coin price', async () => {
    const coin = await getCoinPrice('ADA');
    expect(coin.price).toBeGreaterThan(0);
    expect(coin.date).toBeDefined();
  });

  it('should load transactions', async () => {
    const t = await loadTransactions();
    expect(t.length).toBe(62);
  });

  it('converts timestam to date', () => {
    var date = new Date(btcData.prices[0][0]);
    expect(date.toISOString()).toEqual('2021-02-24T15:09:04.189Z');
  });
  it('should star the database', async () => {
    const db = await startDb();
    expect(db.transactions.length).toBeGreaterThan(0);
  });
  it('should fetch the last transaction', async () => {
    const db = await startDb();
    const last = getLastTransaction(db, 'ADA');
    expect(last).toEqual({
      date: '2021-04-23T00:00:00.000Z',
      altCoin: 'ADA',
      baseCoin: 'BTC',
      type: 'BUY',
      price: 0.0000198,
      amount: 20,
      fee: 0.00003158,
      coinFee: 'BNB',
    });
  });
  it('should fetch the last operation for given coin', async () => {
    const db = await startDb();
    const operation = getLastOperation(db, 'ADA');
    expect(operation).toBe('BUY');
  });
  it('should calculate the BTC price of a coin', async () => {
    const coinPrice = await getCoinPrice('ADA');
    const btcPrice = await getCoinPrice('BTC');
    const coinBTCPrice = getAltCoinBTCPrice(btcPrice, coinPrice);
    // console.log('price: ', coinBTCPrice);
    expect(coinBTCPrice.price > 0).toBeTruthy();
  });
  it('should calculate the sell profit', async () => {
    const db = await startDb();
    const lastTransaction = getLastTransaction(db, 'ADA');
    if (lastTransaction) {
      const profit = await getSellProfitBTC(lastTransaction, 'ADA');
      // console.log('Last transaction: ', lastTransaction);
      // console.log('BTC profit: ', profit);
    }
  });
  it('should create a buy operation', async () => {
    const coinPrice: CoinPrice = {
      date: 1,
      price: 10,
    };
    const lastFilledSellOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 12,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 3,
    };

    const lastFilledBuyOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 11,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 2,
    };

    const r = await loop(
      coinPrice,
      lastFilledSellOrder,
      lastFilledBuyOrder,
      100,
    );

    expect(r.status).toBe('ok');
    expect((await stackPopOrder())?.price).toBe(10);
    expect(await stackPopOrder()).toBeNull();
  });
  it('should create a buy operation', async () => {
    const coinPrice: CoinPrice = {
      date: 1,
      price: 10,
    };
    const lastFilledSellOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 11,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 2,
    };

    const lastFilledBuyOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 12,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 3,
    };

    const r = await loop(
      coinPrice,
      lastFilledSellOrder,
      lastFilledBuyOrder,
      100,
    );

    expect(r.status).toBe('ok');
    expect((await stackPopOrder())?.price).toBe(10);
    expect(await stackPopOrder()).toBeNull();
  });
  it('should not create a buy operation', async () => {
    const coinPrice: CoinPrice = {
      date: 1,
      price: 13,
    };
    const lastFilledSellOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 1,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 2,
    };

    const lastFilledBuyOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 12,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 3,
    };

    const r = await loop(
      coinPrice,
      lastFilledSellOrder,
      lastFilledBuyOrder,
      100,
    );

    expect(r.status).toBe('ok');
    expect(await stackPopOrder()).toBeNull();
  });

  it('should not create a buy operation', async () => {
    const coinPrice: CoinPrice = {
      date: 1,
      price: 13,
    };
    const lastFilledSellOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 11,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 2,
    };

    const lastFilledBuyOrder: OpenOrder = {
      date: new Date(),
      id: 1,
      price: 12,
      quantity: 1,
      side: 'SELL',
      symbol: 'LUNABUSD',
      timestampCreated: 1,
      timestampUpdated: 3,
    };

    await pushBuyOrderToStack(1,10)

    const r = await loop(
      coinPrice,
      lastFilledSellOrder,
      lastFilledBuyOrder,
      100,
    );

    expect(r.status).toBe('ok');
    expect(await stackPopOrder()).toBeNull();
  });
});

const transaction: Transaction = {
  date: new Date(),
  altCoin: 'LTC',
  baseCoin: 'BTC',
  type: 'BUY',
  amount: 69,
  price: 0.00003006,
  coinFee: 'ADA',
  fee: 0.069,
};

const tBuy: Transaction = {
  date: new Date(),
  altCoin: 'ADA',
  baseCoin: 'BTC',
  type: 'BUY',
  amount: 200,
  price: 0.00002167,
  coinFee: 'BNB',
  fee: 0.00038838,
};

const tSell: Transaction = {
  date: new Date(),
  altCoin: 'ADA',
  baseCoin: 'BTC',
  type: 'SELL',
  amount: 100,
  price: 0.00002305,
  coinFee: 'BNB',
  fee: 0.00039845,
};

const transactionHistory: Transaction[] = [
  {
    date: new Date('2021-02-27'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00003115,
    amount: 67,
    fee: 0.00000209,
    coinFee: 'BTC',
  },
  {
    date: new Date('2021-02-27'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00003006,
    amount: 69,
    fee: 0.069,
    coinFee: 'ADA',
  },
  {
    date: new Date('2021-03-05'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00002412,
    amount: 67,
    fee: 0.067,
    coinFee: 'ADA',
  },
  {
    date: new Date('2021-03-28'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00002112,
    amount: 100,
    fee: 0.00032372,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-28'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00002112,
    amount: 100,
    fee: 0.00032372,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-15'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000228,
    amount: 44,
    fee: 0.00008647,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-15'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00002352,
    amount: 44,
    fee: 0.00008814,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-18'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00002167,
    amount: 200,
    fee: 0.00038838,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-19'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00002305,
    amount: 200,
    fee: 0.00039845,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-20'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000208,
    amount: 200,
    fee: 0.00035553,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-21'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.000023,
    amount: 200,
    fee: 0.00032484,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-23'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.000021,
    amount: 66,
    fee: 0.00011079,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-23'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000208,
    amount: 200,
    fee: 0.00033696,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-23'),
    altCoin: 'ADA',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000198,
    amount: 20,
    fee: 0.00003158,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-23'),
    altCoin: 'BNB',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0047533,
    amount: 0.32,
    fee: 0.00023999,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-23'),
    altCoin: 'BNB',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0047533,
    amount: 0.01,
    fee: 0.00000789,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-12'),
    altCoin: 'BNB',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.01,
    amount: 0.07,
    fee: 0.00005229,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-06'),
    altCoin: 'BTT',
    baseCoin: 'BNB',
    type: 'BUY',
    price: 0.0000245,
    amount: 2104,
    fee: 0.00003886,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-05'),
    altCoin: 'BTT',
    baseCoin: 'BNB',
    type: 'SELL',
    price: 0.0000344,
    amount: 2104,
    fee: 0.00005428,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-22'),
    altCoin: 'BTT',
    baseCoin: 'BUSD',
    type: 'BUY',
    price: 0.0035226,
    amount: 8419,
    fee: 0,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-06'),
    altCoin: 'DOGE',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000103,
    amount: 98,
    fee: 0.098,
    coinFee: 'DOGE',
  },
  {
    date: new Date('2021-04-16'),
    altCoin: 'DOGE',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00000355,
    amount: 49,
    fee: 0.0000153,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-16'),
    altCoin: 'DOGE',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.000004,
    amount: 25,
    fee: 0.00000894,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-17'),
    altCoin: 'DOGE',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0000046,
    amount: 24,
    fee: 0.00000984,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-23'),
    altCoin: 'DOT',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00061,
    amount: 2,
    fee: 0.00009804,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-16'),
    altCoin: 'ETH',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.03242,
    amount: 0.022,
    fee: 0.00000071,
    coinFee: 'BTC',
  },
  {
    date: new Date('2021-03-06'),
    altCoin: 'IOST',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000098,
    amount: 103,
    fee: 0.103,
    coinFee: 'IOST',
  },
  {
    date: new Date('2021-04-15'),
    altCoin: 'IOST',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00000119,
    amount: 103,
    fee: 0.00001078,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-20'),
    altCoin: 'LINK',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0006245,
    amount: 4.9,
    fee: 0.00026162,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-20'),
    altCoin: 'LINK',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0006562,
    amount: 2.4,
    fee: 0.00012007,
    coinFee: 'BNB',
  },
  {
    date: new Date('2012-04-22'),
    altCoin: 'LINK',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00072,
    amount: 2.5,
    fee: 0.00012984,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-23'),
    altCoin: 'LINK',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00063,
    amount: 5,
    fee: 0.00025923,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-20'),
    altCoin: 'LTC',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00445,
    amount: 1,
    fee: 0.00037473,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-21'),
    altCoin: 'LTC',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00485,
    amount: 1,
    fee: 0.00035766,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-23'),
    altCoin: 'LTC',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00445,
    amount: 2,
    fee: 0.00075081,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-30'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00003112,
    amount: 33,
    fee: 0.00015096,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-05'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00004,
    amount: 16,
    fee: 0.00007578,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-06'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0000451,
    amount: 1,
    fee: 0.000006,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-06'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0000451,
    amount: 3,
    fee: 0.0000168,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-06'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00005,
    amount: 3,
    fee: 0.00001658,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-07'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00004073,
    amount: 25,
    fee: 0.00010961,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-08'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0000545,
    amount: 8,
    fee: 0.00004857,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-22'),
    altCoin: 'OGN',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000348,
    amount: 33,
    fee: 0.00008233,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-06'),
    altCoin: 'PERL',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000188,
    amount: 54,
    fee: 0.054,
    coinFee: 'PERL',
  },
  {
    date: new Date('2021-03-13'),
    altCoin: 'PERL',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000281,
    amount: 128,
    fee: 0.128,
    coinFee: 'PERL',
  },
  {
    date: new Date('2021-03-24'),
    altCoin: 'PERL',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00000278,
    amount: 90,
    fee: 0.00003982,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-24'),
    altCoin: 'UNI',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00055498,
    amount: 2.2,
    fee: 0.00019491,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-15'),
    altCoin: 'UNI',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00059988,
    amount: 2.2,
    fee: 0.000114,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-15'),
    altCoin: 'UNI',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.000621,
    amount: 1.5,
    fee: 0.00007963,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-21'),
    altCoin: 'UNI',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.000575,
    amount: 1,
    fee: 0.0000368,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-26'),
    altCoin: 'UNI',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.000695,
    amount: 1,
    fee: 0.0000368,
    coinFee: 'BTC',
  },
  {
    date: new Date('2021-03-14'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000011,
    amount: 100,
    fee: 0.1,
    coinFee: 'VET',
  },
  {
    date: new Date('2021-03-18'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000138,
    amount: 101,
    fee: 0.101,
    coinFee: 'VET',
  },
  {
    date: new Date('2021-04-05'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00000162,
    amount: 101,
    fee: 0.0,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-06'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00000197,
    amount: 51,
    fee: 0.00001065,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-08'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000199,
    amount: 181,
    fee: 0.00003846,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-15'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.0000029,
    amount: 114,
    fee: 0.00002843,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-19'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00000451,
    amount: 57,
    fee: 0.00002184,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-22'),
    altCoin: 'VET',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000041,
    amount: 200,
    fee: 0.00005636,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-03-06'),
    altCoin: 'XRP',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.00000952,
    amount: 11,
    fee: 0.011,
    coinFee: 'XRP',
  },
  {
    date: new Date('2021-03-23'),
    altCoin: 'XRP',
    baseCoin: 'BTC',
    type: 'SELL',
    price: 0.00001063,
    amount: 10,
    fee: 0.00001722,
    coinFee: 'BNB',
  },
  {
    date: new Date('2021-04-24'),
    altCoin: 'XRP',
    baseCoin: 'BTC',
    type: 'BUY',
    price: 0.0000214,
    amount: 25,
    fee: 0.00001722,
    coinFee: 'BNB',
  },
];

// describe('test', () => {
//   it('test',()=>{
//     expect(1).toBe(1)
//   })
// })
