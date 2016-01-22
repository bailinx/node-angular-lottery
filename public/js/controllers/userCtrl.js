define(['./module'], function (controllers) {
	'use strict';
	controllers.controller('UserCtrl', ['$scope', 'NotifyService', 'Upload', 'UserService',
		function ($scope, notify, Upload, userService) {
			//userService.getAll(function (err, data) {
			//    if( !err ) {
			//        $scope.userList = data;
			//    } else {
			//        notify.error(err, 'X-MEAN-SEED');
			//    }
			//})
			// upload later on form submit or something similar
			// https://github.com/danialfarid/ng-file-upload
			$scope.userSave = function (user) {
				console.log(user);
				if ($scope.picFile) {
					$scope.upload($scope.picFile);
				}
				//console.log(flow);
			}
			// upload on file select or drop
			$scope.upload = function (file) {
				Upload.upload({
					url: 'user/create',
					data: {file: file, 'user': $scope.user}
				}).then(function (resp) {
					console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				}, function (resp) {
					console.log('Error status: ' + resp.status);
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			};
		}
	]);
});
