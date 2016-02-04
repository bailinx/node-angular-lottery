define(['angular', 'socket'], function (ng, socket) {
	'use strict';
	return ng.module('app.services', ['btford.socket-io']);
});