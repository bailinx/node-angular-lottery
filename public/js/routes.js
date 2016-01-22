define(['./app'], function (app) {
	'use strict';
	return app.config(function ( $stateProvider , $urlRouterProvider ) {
		$stateProvider.state('sys', {
			url: '/sys',
			templateUrl: 'partials/Templates/layout.html'
		})
		.state('sys.index', {
			url: '/index',
			templateUrl: 'partials/Index/index.html',
			controller: 'IndexCtrl'
		})
		.state('sys.create', {
			url: '/userCreate',
			templateUrl: 'partials/User/create.html',
      controller: 'UserCtrl'
		});
		$urlRouterProvider.otherwise('/sys/index');
	});
});