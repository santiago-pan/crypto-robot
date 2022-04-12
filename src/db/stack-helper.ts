import { readFile, saveFile } from './db-helper';

export type DBStack = {
  id: number;
  price: number;
};

export async function pushBuyOrderToStack(id: number, price: number): Promise<void> {
  const stack = await readFile<Array<DBStack>>('stack');
  stack.push({
    id,
    price,
  });
  await saveFile('stack', stack);
}

export async function stackPopOrder(): Promise<{
  id: number;
  price: number;
} | null> {
  const stack = await readFile<Array<DBStack>>('stack');
  const order = stack.pop()
  await saveFile('stack', stack);
  return order ?? null;
}
