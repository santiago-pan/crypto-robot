import {
  getCoinLastPrice,
  getCoinPrice,
  getCoinPriceHistory,
} from '../api/coingecko-api';

describe('coingecko api test', () => {
  it.skip('should fetch price history for coin for last 24 hours', async () => {
    jest.setTimeout(10000);
    const since = 5;
    const history = await getCoinPriceHistory('LUNA', since);
    console.log('data points: ', history.prices);
  });
  it('should return the coin last price', async () => {
    const price = await getCoinLastPrice('LUNA');
    const price2 = await getCoinPrice('LUNA');
    console.log('price: ', price);
    console.log('price data: ', new Date(price?.date ?? 0));

    console.log('price2: ', price2);
    console.log('price2 data: ', new Date(price2?.date ?? 0));
  });
});
