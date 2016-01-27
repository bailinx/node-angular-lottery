define(['./module'], function (services) {
    'use strict';
    services.factory('UserService', ['$rootScope', '$http',
        function ($rootScope, $http) {
            return {
                create: function (user, callback) {
                    $http.post('/user/create', user)
                        .success(function (data, status) {
                            callback(null, data);
                        })
                        .error(function (e) {
                            callback(e);
                        });
                },
                list: function (callback) {
                    $http.get('/user/list')
                        .success(function (data, status) {
                            callback(null, data);
                        })
                        .error(function (e) {
                            callback(e);
                        })
                },
	            delete: function (user, callback) {
		            $http.delete('/user/delete/' + user.workNo)
			            .success(function (data, status) {
				            callback(null, data);
			            })
			            .error(function (e) {
				            callback(e);
			            });
	            },
                lottery: function (callback) {
                    $http.get('/user/lottery')
                        .success(function (data, status) {
                            callback(null, data);
                        })
                        .error(function (e) {
                            callback(e);
                        })
                }
            };
        }
    ])
});