'use strict';

/**
 * @ngdoc function
 * @name giftknacksApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the giftknacksApp
 */
angular.module('giftknacksApp')
  .controller('SignupCtrl', function ($scope, $rootScope, $timeout, $location, AuthService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.user = {
      login: '',
      pass: ''
    };
    $scope.submit = function () {
      AuthService.signup($scope.user).then(function (data) {
        if (parseInt(data.errorCode, 10)===0) {
          $scope.savedSuccessfully = true;
          $scope.message = "User has been registered successfully, you will be redirected to login page in 2 seconds.";
          startTimer();
        } else {
          $scope.savedSuccessfully = false;
          $scope.message = "Failed to register user due to: " + data.errorMessage;
        }

      }, function () {
        $scope.savedSuccessfully = false;
        $scope.message = "Failed to register user due to: " + data.errorMessage;
      });
    };

    var startTimer = function () {
      var timer = $timeout(function () {
        $timeout.cancel(timer);
        $location.path('/login');
      }, 2000);
    }
  });
