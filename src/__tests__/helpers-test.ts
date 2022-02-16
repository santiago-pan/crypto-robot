import {
  getCoinBalance,
  getMaxPriceOpenOrder,
  getMinPriceOpenOrder,
} from '../logic/helpers';
import { OpenOrder, Wallet } from '../logic/types';

describe('helper functions test', () => {
  it('should return min price open order', () => {
    const minPrice = getMinPriceOpenOrder(mock_open_orders);
    expect(minPrice?.price).toBe(55.1);
  });
  it('should return max price open order', () => {
    const minPrice = getMaxPriceOpenOrder(mock_open_orders);
    expect(minPrice?.price).toBe(101.84);
  });
  it('should return the coing balance', () => {
    expect(getCoinBalance('LUNA', mock_wallet)).toBe(3);
    expect(getCoinBalance('BUSD', mock_wallet)).toBe(745.494088);
  });
});

const mock_wallet: Wallet = {
  balances: [
    { coin: 'BNB', free: 0.00027584, locked: 0 },
    { coin: 'BUSD', free: 745.494088, locked: 55.1 },
    { coin: 'LUNA', free: 3, locked: 9 },
  ],
};

const mock_open_orders: ReadonlyArray<OpenOrder> = [
  {
    id: 1,
    date: new Date('2021-12-27T05:09:20.303Z'),
    price: 101.84,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1640581760303,
  },
  {
    id: 2,
    date: new Date('2021-12-27T12:27:38.035Z'),
    price: 99.27,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1640608058035,
  },
  {
    id: 3,
    date: new Date('2021-12-28T02:13:43.814Z'),
    price: 98.08,
    quantity: 2,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1640657623814,
  },
  {
    id: 4,
    date: new Date('2022-01-06T06:20:09.617Z'),
    price: 88.22,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1641450009617,
  },
  {
    id: 5,
    date: new Date('2022-01-06T06:20:16.727Z'),
    price: 89.77,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1641450016727,
  },
  {
    id: 6,
    date: new Date('2022-01-18T10:25:30.260Z'),
    price: 85.09,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1642501530260,
  },
  {
    id: 7,
    date: new Date('2022-01-22T16:02:42.221Z'),
    price: 55.1,
    quantity: 1,
    side: 'BUY',
    symbol: 'LUNABUSD',
    timestapm: 1642867362221,
  },
  {
    id: 8,
    date: new Date('2022-01-25T08:22:17.095Z'),
    price: 67.39,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1643098937095,
  },
  {
    id: 9,
    date: new Date('2022-01-27T07:27:54.577Z'),
    price: 59.11,
    quantity: 1,
    side: 'SELL',
    symbol: 'LUNABUSD',
    timestapm: 1643268474577,
  },
];
