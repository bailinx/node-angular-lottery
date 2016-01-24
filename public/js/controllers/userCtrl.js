define(['./module'], function (controllers) {
	'use strict';
	controllers.run
	controllers.controller('UserCtrl', ['$scope', 'NotifyService', 'Upload', 'UserService',
		function ($scope, notify, Upload, userService) {
			// event
			$scope.$on('event:user-refresh', function(d,data) {
				$scope.totalItems = data.length;
				if(!$scope.currentPage) {
					$scope.currentPage = 1;
				}
				$scope.setPage = function (pageNo) {
					$scope.currentPage = pageNo;
				};

				$scope.pageChanged = function() {
					if(data.length <= $scope.maxSize) {
						$scope.userList = data;
					} else if($scope.currentPage * $scope.maxSize <= data.length) {
						$scope.userList = data.slice(($scope.currentPage - 1) * $scope.maxSize, $scope.currentPage * $scope.maxSize);
					} else {
						$scope.userList = data.slice(($scope.currentPage - 1) * $scope.maxSize, data.length);
					}
				};

				$scope.maxSize = 10;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
				if(data.length <= $scope.maxSize) {
					$scope.userList = data;
				} else if($scope.currentPage * $scope.maxSize <= data.length) {
					$scope.userList = data.slice(($scope.currentPage - 1) * $scope.maxSize, $scope.currentPage * $scope.maxSize);
				} else {
					$scope.userList = data.slice(($scope.currentPage - 1) * $scope.maxSize, data.length);
				}
			});

			// user list
			userService.list(function (err, data) {
				if (!err) {
					$scope.userCache = data;
					$scope.$broadcast('event:user-refresh', $scope.userCache);
				} else {
					notify.error('获取用户列表失败.', 'node-angular-lottery');
				}
			});

			$scope.userDel = function (id) {
				angular.forEach($scope.userCache, function (user, idx) {
					if(user._id == id) {
						userService.delete(user, function (err, data) {
							if (!err) {
								if('success' != data) {
									notify.success('删除[' + user.name + ']失败,原因是' + data, 'node-angular-lottery');
								} else {
									$scope.userCache.splice(idx, 1);
									$scope.$broadcast('event:user-refresh', $scope.userCache);
									notify.success('删除[' + user.name + ']成功!', 'node-angular-lottery');
								}
							} else {
								notify.error('删除用户失败.', 'node-angular-lottery');
							}
						});
					}
				});
			}
			// https://github.com/danialfarid/ng-file-upload
			$scope.userSave = function (user) {
				if ($scope.picFile) {
					$scope.upload($scope.picFile);
					$scope.userCache.push(user);
					$scope.$broadcast('event:user-refresh', $scope.userCache);
				}
			};

			// upload on file select or drop
			$scope.upload = function (file) {
				Upload.upload({
					url: 'user/create',
					data: {file: file, 'user': $scope.user}
				}).then(function (resp) {
					//console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
					$scope.user = null;
					$scope.picFile = null;
					notify.success('添加成功!', 'node-angular-lottery');
				}, function (resp) {
					//console.log('Error status: ' + resp.status);
					notify.error('失败了.' + resp.status, 'node-angular-lottery');
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			};
		}
	]);
});
