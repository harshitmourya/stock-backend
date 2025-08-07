const Stock = require('../models/stockSchema');
const yahooFinance = require('yahoo-finance2').default;
const Parser = require('rss-parser');

yahooFinance.suppressNotices(['yahooSurvey']);
const parser = new Parser();

const getStockPrice = async (req, res) => {
  let symbol = req.params.symbol.toUpperCase();

  if (!symbol.endsWith('.NS')) {
    symbol = symbol + '.NS';
  }

  const companyName = symbol.split('.')[0];

  try {
    const data = await yahooFinance.quote(symbol);
    const CurrentPrice = data.regularMarketPrice;

    const ltp = data.regularMarketPrice;
    const avg50 = data.fiftyDayAverage;
    const avg200 = data.twoHundredDayAverage;
    const changePercent = data.regularMarketChangePercent;
    const volume = data.regularMarketVolume;
    const trendStrength = Math.abs(avg50 - avg200);
    const strongVolume = volume > 5000000;

    let pseudoADX = '';
    if (trendStrength > 50 && strongVolume) {
      pseudoADX = 'Strong';
    } else if (trendStrength < 20) {
      pseudoADX = 'Weak';
    } else {
      pseudoADX = 'Moderate';
    }

    let pseudoRSI = '';
    if (changePercent > 2 && ltp > avg50) {
      pseudoRSI = 'High';
    } else if (changePercent < -2 && ltp < avg50) {
      pseudoRSI = 'Low';
    } else {
      pseudoRSI = 'Neutral';
    }

    let suggestion = '';
    let reason = '';
    let entry = null;
    let target = null;
    let stopLoss = null;

    if (pseudoADX === 'Strong') {
      if (pseudoRSI === 'Low') {
        suggestion = 'BUY';
        reason = 'Stock oversold in strong trend';
        entry = ltp;
        target = parseFloat((ltp * 1.04).toFixed(2));
        stopLoss = parseFloat((ltp * 0.97).toFixed(2));
      } else if (pseudoRSI === 'High') {
        suggestion = 'SELL';
        reason = 'Stock overbought in strong trend';
        entry = ltp;
        target = parseFloat((ltp * 0.96).toFixed(2));
        stopLoss = parseFloat((ltp * 1.03).toFixed(2));
      } else if (changePercent > 0) {
        suggestion = 'BUY';
        reason = 'Positive move in strong trend';
        entry = ltp;
        target = parseFloat((ltp * 1.03).toFixed(2));
        stopLoss = parseFloat((ltp * 0.98).toFixed(2));
      } else {
        suggestion = 'SELL';
        reason = 'Negative move in strong trend';
        entry = ltp;
        target = parseFloat((ltp * 0.97).toFixed(2));
        stopLoss = parseFloat((ltp * 1.02).toFixed(2));
      }
    } else if (pseudoADX === 'Weak') {
      suggestion = 'Please wait ';
      reason = 'No clear trend in price movement';
    } else {
      suggestion = 'HOLD';
      reason = 'Wait for stronger momentum or direction';
    }

    const feed = await parser.parseURL(
      `https://news.google.com/rss/search?q=${encodeURIComponent(companyName)}+stock&hl=en-IN&gl=IN&ceid=IN:en`
    );
    const news = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }));

    const ExistingSymbol = await Stock.findOne({ symbol });
    if (ExistingSymbol) {
      ExistingSymbol.CurrentPrice = CurrentPrice;
      await ExistingSymbol.save();
    } else {
      const stock = new Stock({ symbol, CurrentPrice });
      await stock.save();
    }

    res.status(200).json({
      symbol,
      ltp,
      avg50,
      avg200,
      changePercent,
      volume,
      pseudoRSI,
      pseudoADX,
      suggestion,
      reason,
      entry,
      target,
      stopLoss,
      CurrentPrice,
      news
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching stock price or news',
      error: error.message,
    });
  }
};

module.exports = { getStockPrice };
