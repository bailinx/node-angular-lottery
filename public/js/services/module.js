define(['angular', 'socket'], function (ng) {
	'use strict';
	return ng.module('app.services', ['btford.socket-io']);
});