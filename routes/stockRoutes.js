const express = require("express");
const router = express.Router();

const { getStockPrice }= require('../controllers/stockController');
const { getTopGainers } = require("../controllers/topGainers");



router.get('/:symbol',getStockPrice);
router.get('/top-gainers',getTopGainers);

module.exports = router;