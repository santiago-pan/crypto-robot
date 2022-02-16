import 'dotenv/config';
import cron from 'node-cron';
import { runTradeEngine } from './logic/formulas';

if (process.env.MODE !== 'PRODUCTION') {
  console.log('Running in TEST mode');
} else {
  console.log('Runing in PRODUCTION mode');
}

cron.schedule('*/1 * * * *', () => {
  const date = new Date();
  console.log(`Date: ${date.toISOString().replace('T', ' ').replace('Z', '')}`);

  runTradeEngine();
});
