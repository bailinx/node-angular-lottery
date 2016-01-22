define(['./module'], function (services) {
    'use strict';
    services.factory('UserService', ['$rootScope', '$http',
        function ($rootScope, $http) {
            return {
                create: function (credentials, callback) {
                    $http.post('/user/create', credentials)
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