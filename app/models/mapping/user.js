'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	workNo: String,
	name: String,
	picPath: String,
	ip: String,
	phone: String,
	hasSend: Number
});

mongoose.model('user', schema);