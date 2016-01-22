'use strict';
var userController = {},
	userModel = require('../models/user'),
	config = require('../config/config'),
	logger = require('../utils/log').logger;

userController.list = function (req, res, next) {
	userModel.getAll(function (err, data) {
		res.json(data);
	});
	// res.send('respond with a resource');
}

userController.get = function (req, res, next) {
	res.send('id : ' + req.params.id);
}

userController.create = function (req, res, next) {
	var fs = require("fs");
	var file = req.files.file;
	console.log(file);
	var temp_path = file.path,
		new_path = config.uplpadDir + file.name;
	fs.rename(temp_path, new_path, function(err) {
		if(err) {
			logger.error(err);
		}
	});
	new userModel.create({
		workNo: Math.floor(1000 + Math.random() * (9999 - 1000)) + '',
		picPath: new_path,
		ip: '127.0.0.1',
		phone: '13333333333',
		luckMan: ''
	},function (err, data) {
		res.json(data);
	});
};


userController.lottery = function (req, res, next) {

};

module.exports = userController;