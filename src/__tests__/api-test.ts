import fetch from 'node-fetch';
import { BASE_API, getCoinPriceHistory } from '../api/api';
import { IJsonResponse, IResponse } from '../api/types';


let mockTokenFromAPI: string | undefined;

jest.mock(`node-fetch`, () => {
  const generateResponse = (): IResponse => {
    return {
      json: (): IJsonResponse => ({
        data: {
          prices: [
            [1614179344189, 49507.27881373312],
            [1614182720216, 49825.04964378574],
          ],
        },
      }),
    };
  };

  return jest.fn().mockResolvedValue(generateResponse());
});

describe('api test', () => {
  beforeEach(() => {
    // jest.resetAllMocks();
  });

  it('should fetch price history for coin', async () => {
    const since = 24;
    const to = Math.floor(new Date().getTime() / 1000);
    const from = to - since * 60 * 60;
    const history = await getCoinPriceHistory('LUNA', since);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_API}coins/terra-luna/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
    );
    expect(history.data.prices.length).toBe(2)
  });
});
