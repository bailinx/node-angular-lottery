define(['./module'], function (controllers) {
	'use strict';
	controllers.controller('IndexCtrl', ['$scope' , 'NotifyService', 'SocketService',
		function ($scope, notify, socket) {
            $scope.hasSendList = [];

            socket.on('user.notSendList.repley',function (data) {
				console.log(data);
			});
			socket.emit('user.notSendList');

            // 所有有礼物的人
            socket.on('user.hasSendList.repley', function (data) {
                console.log(data);
            });
            socket.emit('user.hasSendList');

			notify.success('Loading completed.', 'node-angular-lottery');
		}
	]);
});