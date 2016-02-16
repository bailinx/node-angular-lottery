define(['./module', 'socket-io'], function (services, io) {
    'use strict';
    services.factory('SocketService', ['$rootScope',
            function ($rootScope) {
                // 使用angular-socket-io始终io is undefined，蛋疼
var socket = io.connect();
return {
    on: function (eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            })
        })
    },
    emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if( callback ) {
                    callback.apply(socket, args);
                }
            })
        })
    }
}
            }
        ]);
});