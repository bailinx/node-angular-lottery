'use strict';
var indexController = {};

indexController.index = function (req, res, next) {
	res.send('node-angular-lottery');
}

module.exports = indexController;