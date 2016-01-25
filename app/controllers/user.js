'use strict';
var userController = {},
	userModel = require('../models/user'),
	config = require('../config/config'),
	logger = require('../utils/log').logger;

userController.list = function (req, res, next) {
	userModel.getAll(function (err, data) {
		res.json(data);
	});
}

userController.get = function (req, res, next) {
	res.send('id : ' + req.params.id);
}

userController.create = function (req, res, next) {
	var fs = require("fs"),
		file = req.files.file,
		temp_path = file.path,
		new_path = config.uplpadDir + file.name;
	fs.rename(temp_path, new_path, function(err) {
		if(err) {
			logger.error(err);
		}
	});
	userModel.create({
		workNo: req.body.user.workNo,
		name: req.body.user.name,
		picPath: new_path,
		ip: req.body.user.ip,
		phone: req.body.user.phone,
		hasSend: 0
	}, function (err, data) {
		if(!err) {
			res.json(data);
		} else {
			logger.error(err);
			res.send('500');
		}
	});
};

userController.delete = function (req, res, next) {
	logger.warn(req.connection.remoteAddress + '/delete/' + req.params.id);
	userModel.delete({ _id: req.params.id }, function (err) {
		if(!err) {
			res.send('success');
		} else {
			logger.error(err);
			res.send('500');
		}
	});
};

userController.lottery = function (req, res, next) {

};

module.exports = userController;