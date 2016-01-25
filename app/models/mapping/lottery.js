'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    sendUserID: String,
    recUserID: String,
    lotteryTime: Date
});

mongoose.model('lottery', schema);