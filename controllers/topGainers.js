const Stock = require('../models/stockSchema');

const getTopGainers = async (req, res) => {
  try {
    const allStocks = await Stock.find();

    const sorted = allStocks
      .filter(stock => stock.open && stock.close)
      .map(stock => ({
        symbol: stock.symbol,
        gainPercent: ((stock.close - stock.open) / stock.open) * 100
      }))
      .sort((a, b) => b.gainPercent - a.gainPercent);

    const top5 = sorted.slice(0, 5);
  return  res.json(top5);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching gainers', error });
  }
};

module.exports = { getTopGainers };
