'use strict';
var userController = {},
	userModel = require('../models/mapping').user,
	config = require('../config/config'),
	logger = require('../utils/log').logger;

userController.list = function (req, res, next) {
	userModel.find({}, function (err, data) {
		res.json(data);
	});
}

userController.get = function (req, res, next) {
	res.send('id : ' + req.params.id);
}

userController.create = function (req, res, next) {
	var fs = require("fs"),
		file = req.files.file,
		timestamp = Math.round(new Date().getTime()/1000),
        newFileName = timestamp + "." + file.name.split('.')[file.name.split('.').length - 1],
		temp_path = file.path,
		new_path = config.uplpadDir + newFileName;
	fs.rename(temp_path, new_path, function(err) {
		if(err) {
			logger.error(err);
		}
	});
	userModel.create({
		workNo: req.body.user.workNo,
		name: req.body.user.name,
		picPath: "upload/" + newFileName,
		//ip: req.body.user.ip,
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
	logger.warn(req.connection.remoteAddress + '/delete/' + req.params.workNo);
	userModel.remove({ workNo: req.params.workNo }, function (err) {
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