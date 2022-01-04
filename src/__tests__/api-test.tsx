import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { BASE_API, getCoinPriceHistory } from '../api/api';

enableFetchMocks();

describe('api test', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should fetch price history for coin', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          prices: [
            [1614179344189, 49507.27881373312],
            [1614182720216, 49825.04964378574],
          ],
        },
      }),
    );

    const since = 24;
    const to = Math.floor(new Date().getTime() / 1000);
    const from = to - since * 60 * 60;
    const history = await getCoinPriceHistory('LUNA', since);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(
      `${BASE_API}coins/terra-luna/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
    );

    console.log('h', history);
  });
});
