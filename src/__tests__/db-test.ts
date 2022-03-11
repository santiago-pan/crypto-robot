import { log } from '../db/logger';
import { pushBuyOrderToStack, stackPopOrder } from '../db/stack-helper';

describe('DB test', () => {
  it.skip('should stack a new order', async () => {
    await pushBuyOrderToStack(1, 100);
    const order = await stackPopOrder();
    expect(order?.id).toBe(1);
    expect(order?.price).toBe(100);
    expect(await stackPopOrder()).toBe(null);
  });
  it.skip('should add a line to the log', async () => {
    await log('Test line 1')
    await log('Test line 2')
  })
});
