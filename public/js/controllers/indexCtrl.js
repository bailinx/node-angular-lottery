define(['./module'], function (controllers) {
	'use strict';
	controllers.controller('IndexCtrl', ['$scope', '$uibModal', 'NotifyService', 'SocketService',
		function ($scope, $uibModal, notify, socket) {
            // 初始化
			$scope.userInfo = {};
            $scope.workNo = "";
            $scope.open = function (size) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    backdrop: 'static',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        workNo: function () {
                            return $scope.workNo;
                        }
                    }
                });

                modalInstance.result.then(function (workNo) {
                    $scope.workNo = workNo;
                    socket.emit('user.info', workNo);
                    console.log("workno:" + workNo);
                }, function () {
                    notify.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.$watch('userInfo', function(newValue, oldValue, scope) {
                scope.open('sm');
                console.log(newValue + ":" +oldValue);
            });
			$scope.hasSendList = [];
			$scope.userCache = [];

			// 用户信息
			socket.emit('user.info', '');
			socket.on('user.info.repley', function (result) {
				if(result.status == 'success') {
					$scope.userInfo = result.data;
					console.log(result);
				}
			});

			// 抽奖
			$scope.lottery = function (id) {
				socket.emit('user.lottery', id);
			}

			// 最新抽奖信息
			socket.on('user.lottery.new', function (data) {
				notify.success("抽奖信息" + data[0].name + " -> " + data[1].name);
				//console.log("抽奖信息");
				//console.log(data);
			});
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
	// model controller
	controllers.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, workNo) {
        $scope.workNo = workNo;
		$scope.ok = function () {
			$uibModalInstance.close(workNo);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
});