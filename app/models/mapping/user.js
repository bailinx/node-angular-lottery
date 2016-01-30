'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	workNo: String,
	name: String,
	picPath: String,
	ip: String,
	phone: String,
	sendPeo: {}, // 他送礼物的人
	recivePeo: {} // 送他礼物的人
});

mongoose.model('user', schema);