import 'dotenv/config';
import cron from 'node-cron';
import { callLoop } from './logic/formulas';

if (process.env.MODE !== 'PRODUCTION') {
  console.log('Running in TEST mode');
} else {
  console.log('Runing in PRODUCTION mode');
}

cron.schedule('*/30 * * * * *', () => {
  callLoop();
});
