define(['./module'], function (controllers) {
	'use strict';
	controllers.config(function (localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('node-angular-lottery')
			.setStorageType('sessionStorage')
			.setNotify(true, true)
	});
	controllers.controller('IndexCtrl', ['$scope', '$uibModal', 'NotifyService', 'SocketService', 'localStorageService',
		function ($scope, $uibModal, notify, socket, localStorageService) {
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
                }, function () {
                    notify.info('Modal dismissed at: ' + new Date());
                });
            };

			$scope.hasSendList = [];
			$scope.userCache = [];

			// 读取用户信息
			if(!localStorageService.isSupported) {
				notify.info("不支持sessionStorage，无法保存用户信息");
			} else {
				var userInfo = localStorageService.get('UserInfo');
				if(userInfo) {
					socket.emit('user.info', userInfo.workNo);
					//$scope.userInfo = userInfo;
				} else {
					$scope.open('sm');
				}
			}

			// 用户信息
			//socket.emit('user.info', '');
			socket.on('user.info.repley', function (result) {
				if(result.status == 'success') {
					$scope.userInfo = result.data;
					// 将用户信息保存到本地
					if(localStorageService.isSupported) {
						localStorageService.set('UserInfo', $scope.userInfo);
					}
				} else {
					notify.warn(result.data);
					if(localStorageService.isSupported) {
						localStorageService.remove('UserInfo');
					}
					$scope.userInfo = {};
					$scope.open('sm');
				}
			});

			// 抽奖
			$scope.lottery = function (id) {
				socket.emit('user.lottery', id);
			}

			// 最新抽奖信息
			socket.on('user.lottery.new', function (user) {

				//$(".gift-list").appendTo(user.name + " -> " + user.sendPeo.name);
				//var lotteryItem = $("<li><a href='javascript:;'>" + user.name + "的有猿人是" + user.sendPeo.name +"</a></li>");
				//lotteryItem.appendTo($(".rounded-list"));
				//lotteryItem.fadeIn(1000);
				socket.emit('user.hasSendList');

				notify.success(user.name + "的有猿人是" + user.sendPeo.name);
			});

            // 已送礼物列表
			socket.emit('user.hasSendList');
            socket.on('user.hasSendList.repley', function (data) {
				$scope.hasSendTotal = data.length;
				$scope.hasSendList = data;
				//$scope.hasSendList = getRandomArrayItems(data, 7);
	            //console.log(data);
				function getRandomArrayItems(arr, num) {
					//新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
					var temp_array = new Array();
					for (var index in arr) {
						temp_array.push(arr[index]);
					}
					//取出的数值项,保存在此数组
					var return_array = new Array();
					for (var i = 0; i<num; i++) {
						//判断如果数组还有可以取出的元素,以防下标越界
						if (temp_array.length>0) {
							//在数组中产生一个随机索引
							var arrIndex = Math.floor(Math.random()*temp_array.length);
							//将此随机索引的对应的数组元素值复制出来
							return_array[i] = temp_array[arrIndex];
							//然后删掉此索引的数组元素,这时候temp_array变为新的数组
							temp_array.splice(arrIndex, 1);
						} else {
							//数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
							break;
						}
					}
					return return_array;
				}
            });

			// 送礼物消息
			socket.on('user.lottery.reply', function (data) {
				//notify.success("1111抽奖信息" + reult.user.name + " -> " + reult.user.sendPeo.name);
				notify.info(data.msg);

				$scope.userInfo = data.user;
				// 将用户信息保存到本地
				if(localStorageService.isSupported) {
					localStorageService.set('UserInfo', $scope.userInfo);
				}
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

			// 事件绑定
			$(".red-packet").click(function(){
				$(this).addClass("shake");
				$scope.lottery($scope.userInfo._id);
				setTimeout(function(){
					$(".red-packet").removeClass("shake");
					$(".windows").fadeIn();
					$(".mask").fadeIn();
				},2000);
			});
			$(".close").click(function(){$(this).parent().fadeOut();$(".mask").fadeOut()});
		}
	]);
	// model controller
	controllers.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, workNo) {
        $scope.workNo = workNo;
		$scope.ok = function () {
			$uibModalInstance.close($scope.workNo);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
});