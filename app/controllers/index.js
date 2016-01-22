'use strict';
var indexController = {};

indexController.index = function (req, res, next) {
	res.render('index', {title: 'lottery'});
}

module.exports = indexController;