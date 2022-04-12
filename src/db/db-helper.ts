import fs from 'fs';
import { BinanceOrder, CoinPrice } from '../api/api-types';
import {
  ALT_COIN,
  Asset,
  COINS,
  Transaction,
  TRANSACTION_TYPE,
} from '../logic/types';
import { DBPrices } from './types';

export type DB = {
  wallet: Map<COINS, Asset>;
  transactions: Array<Transaction>;
};

export let DB: DB = {
  wallet: new Map(),
  transactions: [],
};

export async function startDb() {
  DB = {
    wallet: await loadAssets(),
    transactions: await loadTransactions(),
  };
  return DB;
}

export function getLastTransaction(db: DB, coin: ALT_COIN) {
  return db.transactions.filter((t) => t.altCoin === coin).pop() ?? null;
}

export function getLastOperation(
  db: DB,
  coin: ALT_COIN,
): TRANSACTION_TYPE | null {
  return getLastTransaction(db, coin)?.type ?? null;
}

export async function saveTransactions(jsonFile: Array<Transaction>) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      './src/db/transactions.json',
      JSON.stringify(jsonFile),
      (error) => {
        if (!error) {
          resolve('ok');
        }
        reject(error);
      },
    );
  });
}

export async function saveBinanceOrders(jsonFile: ReadonlyArray<BinanceOrder>) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      './src/db/binance-orders.json',
      JSON.stringify(jsonFile),
      (error) => {
        if (!error) {
          resolve('ok');
        }
        reject(error);
      },
    );
  });
}

export async function loadTransactions(): Promise<Array<Transaction>> {
  return new Promise((resolve, reject) => {
    fs.readFile('./src/db/transactions.json', function read(err, data) {
      if (err) {
        throw err;
      }
      const jsonFile = data.toString();
      resolve(JSON.parse(jsonFile));
    });
  });
}

export async function saveAssets(jsonFile: Map<COINS, Asset>) {
  return new Promise((resolve, reject) => {
    fs.writeFile('./src/db/assets.json', JSON.stringify(jsonFile), (error) => {
      if (!error) {
        resolve('ok');
      }
      reject(error);
    });
  });
}

export async function loadAssets(): Promise<Map<COINS, Asset>> {
  return new Promise((resolve, reject) => {
    fs.readFile('./src/db/assets.json', function read(err, data) {
      if (err) {
        throw err;
      }
      const jsonFile = data.toString();
      resolve(JSON.parse(jsonFile));
    });
  });
}

export async function updateLastPrice(
  coin: ALT_COIN,
  price: CoinPrice,
): Promise<void> {
  const db = await readFile<DBPrices>('db')
  db[coin].lastPrice = price.price
  db[coin].history.push(price)
  await saveFile('db', db)
}

export async function readFile<T>(filename: string): Promise<T> {
  return new Promise((resolve, reject) => {
    fs.readFile(`./src/db/${filename}.json`, function read(err, data) {
      if (err) {
        throw err;
      }
      const jsonFile = data.toString();
      resolve(JSON.parse(jsonFile));
    });
  });
}

export async function saveFile(filename: string, data: any) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./src/db/${filename}.json`, JSON.stringify(data), (error) => {
      if (!error) {
        resolve('ok');
      }
      reject(error);
    });
  });
}
