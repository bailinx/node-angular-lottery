'use strict';
var userController = {},
	userModel = require('../models/user');

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
	var user = new userModel({
    workNo: Math.floor(1000 + Math.random()*(9999 - 1000)) + '',
    picPath: '111',
    ip: '127.0.0.1',
    phone: '13333333333',
    luckMan: ''
	});
	user.create(function (err, data) {
		res.send(user);
	});
};


userController.lottery = function (req, res) {

};

module.exports = userController;