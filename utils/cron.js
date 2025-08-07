const cron = require('node-cron');
const updateAllStocks = require('../controllers/updateAllStocks');

const startCronJob = () => {
  cron.schedule('16 9 * * 1-5', () => {
    console.log('⏰ Running stock update cron job...');
    updateAllStocks();
  });
};

module.exports = startCronJob;
