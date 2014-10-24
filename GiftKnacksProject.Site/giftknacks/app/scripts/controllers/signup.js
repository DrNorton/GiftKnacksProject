'use strict';

/**
 * @ngdoc function
 * @name giftknacksApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the giftknacksApp
 */
angular.module('giftknacksApp')
  .controller('SignupCtrl', function ($scope, $rootScope, $timeout, $location, AUTH_EVENTS, AuthService) {

    $scope.savedSuccessfully = false;// TODO: заменить на константу
    $scope.message = "";

    $scope.credentials = {
      login: '',
      pass: ''
    };
    $scope.signup = function (credentials) {
      AuthService.signup(credentials).then(function (data) {
        if (parseInt(data.errorCode, 10)===0) {
          $rootScope.$broadcast(AUTH_EVENTS.registerSuccess);
          $scope.savedSuccessfully = true;// TODO: заменить на константу
          $scope.message = "User has been registered successfully, you will be redirected to login page in 2 seconds.";
          startTimer();

        } else {
          $rootScope.$broadcast(AUTH_EVENTS.registerFailed);
          $scope.savedSuccessfully = false;// TODO: заменить на константу
          $scope.message = "Failed to register user due to: " + data.errorMessage;
        }

      }, function () {
        $rootScope.$broadcast(AUTH_EVENTS.registerFailed);
        $scope.savedSuccessfully = false;// TODO: заменить на константу
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
