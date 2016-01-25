define(['./module'], function (controllers) {
	'use strict';
	controllers.controller('IndexCtrl', ['$scope' , 'NotifyService', 'SocketService',
		function ($scope, notify, socket) {
            $scope.hasSendList = [];
			$scope.userCache = [];

			// 抽奖
			$scope.lottery = function (id) {
				socket.emit('user.lottery', id);
			}

			// 最新抽奖信息
			socket.on('user.lottery.new', function (data) {
				console.log("抽奖信息");
				console.log(data);
			});
			//socket.on('user.notSendList.repley',function (data) {
			//	console.log(data);
			//});
			//socket.emit('user.notSendList');
			// 所有用户
			socket.emit('user.getAll');
			socket.on('user.getAll.repley', function (data) {
				console.log(data);
			});
            // 已送礼物列表
			socket.emit('user.hasSendList');
            socket.on('user.hasSendList.repley', function (data) {
                console.log(data);
            });
			// 用户信息
			socket.emit('user.info', '090491');
			socket.on('user.info.repley', function (data) {
				$scope.userInfo = data;
				console.log(data);
			});
			// 送礼物消息
			socket.on('user.lottery.repley', function (data) {
				console.log(data);
			});


			// Success
			socket.on('system.success', function (data) {
				notify.success(data.msg);
			});
			// Info
			socket.on('system.info', function (data) {
				notify.info(data.msg);
			});
			// 错误信息
			socket.on('system.error', function (data) {
				notify.error(data.msg);
			});
			notify.success('Loading completed.', 'node-angular-lottery');
		}
	]);
});