import { getCoinPriceHistory } from '../api/coingecko-api';

describe('coingecko api test', () => {
  it.skip('should fetch price history for coin for last 24 hours', async () => {
    jest.setTimeout(10000);
    const since = 5;
    const history = await getCoinPriceHistory('LUNA', since);
    console.log('data points: ', history.prices);
  });
});
