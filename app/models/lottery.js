'use strict';
var base = require('./base'),
    lottery = require('./mapping').lottery,
    logger = require('../utils/log').logger;

var lotteryModel = new base( lottery );

// 扩展方法

module.exports = lotteryModel;