define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('UserCtrl', ['$scope', 'NotifyService', 'UserService',
    function ($scope, notify, userService) {
      //userService.getAll(function (err, data) {
      //    if( !err ) {
      //        $scope.userList = data;
      //    } else {
      //        notify.error(err, 'X-MEAN-SEED');
      //    }
      //})
      $scope.userSave = function(user) {
        console.log(user);
        //console.log(flow);
      }
      console.log($scope);
    }
  ]);
});
