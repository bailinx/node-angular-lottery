'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    sendUserID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    recUserID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    lotteryTime: Date
});

mongoose.model('lottery', schema);