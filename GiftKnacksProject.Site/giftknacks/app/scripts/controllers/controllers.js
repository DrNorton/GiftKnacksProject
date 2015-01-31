'use strict';

//this is used to parse the profile
function urlBase64Decode(str) {
  var output = str.replace('-', '+').replace('_', '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }
  return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ApplicationCtrl
 * @description
 * Контроллер всего приложения
 * Controller of the giftknacksApp
 */
angular.module('giftknacksApp')
  .controller('ApplicationCtrl', function ($scope, $modal, AuthService, $log, $location) {
    $scope.currentUser = null;
    $scope.isAuthenticated = false;
    $scope.message = '';
    $scope.$on('user_auth', function (event, message) {
      $scope.message = message;
    });
    /*$scope.setCurrentUser = function (user) {
     $scope.currentUser = user;
     };*/


    $scope.open = function (tpl, ctrl, size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/' + tpl,
        controller: ctrl,
        size: size/*,
         resolve: {
         items: function () {
         return $scope.items;
         }
         }*/
      });

      modalInstance.result.then(function (message) {
        $scope.message = message;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    $scope.navLinks = [
      {
        title: 'landing',
        text: 'GiftKnacks',
        show: true
      },
      {
        title: 'about',
        text: 'About',
        show: true
      },
      {
        title: 'dashboard',
        text: 'Dashboard',
        show: $scope.isAuthenticated
    }];

    $scope.navClass = function (page) {
      var currentRoute = $location.path().substring(1) || 'landing';
      return page === currentRoute ? 'active' : '';
    };
  })

/**
 * @ngdoc function
 * @name giftknacksApp.controller:MainCtrl
 * @description
 * # Контроллер главной страницы
 * Controller of the giftknacksApp
 */
  .controller('MainCtrl', function ($scope) {
  })

/**
 * @ngdoc function
 * @name giftknacksApp.controller:UserCtrl
 * @description
 * # Контроллер авторизации и регистрации
 * Controller of the giftknacksApp
 */
  .controller('UserCtrl', function ($scope, $http, $window, AuthService, $modalInstance, $location) {
    $scope.savedSuccessfully = false;
    $scope.isAuthenticated = false;
    $scope.message = '';
    $scope.user = {
      username: '',
      password: ''
    };

    $scope.signup = function () {
      AuthService.access($scope.user, 'register').then(function (data) {
        if (parseInt(data.errorCode, 10) === 0) {
          $scope.savedSuccessfully = true;
          $scope.message = 'User has been registered successfully';
        } else {
          $scope.savedSuccessfully = false;
          $scope.message = 'Failed to register user due to: ' + data.errorMessage;
        }

      }, function (data) {
        $scope.savedSuccessfully = false;
        $scope.message = 'Failed to register user due to: ' + data.errorMessage;
      });
    };
    $scope.login = function () {
      $scope.isAuthenticated = true;
      $scope.message = 'Allrighty!';
      $modalInstance.close($scope.message);
      $location.path("dashboard")
      /*AuthService.access($scope.user, 'login').then(function (response) {
        var data=response.result||{};
        if (parseInt(response.errorCode, 10) === 0) {
          $window.sessionStorage.token = data.token;
          $scope.isAuthenticated = true;
          var encodedProfile = data.token.split('.')[1];
          var profile = JSON.parse(urlBase64Decode(encodedProfile));
          $scope.message = 'Allrighty!';
          $modalInstance.close($scope.message);
        } else {
          delete $window.sessionStorage.token;
          $scope.isAuthenticated = false;
          // Handle login errors here
          $scope.message = 'Failed to register user due to: ' + response.errorMessage;
        }
        $scope.$emit('user_auth', $scope.message);
      }, function (response) {
        delete $window.sessionStorage.token;
        $scope.isAuthenticated = false;
        // Handle login errors here
        $scope.message = 'Failed to register user due to: ' + response.errorMessage;
        $scope.$emit('user_auth', $scope.message);
      });*/

    };
    $scope.logout = function () {
      $scope.message = '';
      $scope.isAuthenticated = false;
      delete $window.sessionStorage.token;
    };
    $scope.callRestricted = function () {
      $http({url: '/api/restricted', method: 'GET'})
        .success(function (data, status, headers, config) {
          $scope.message = $scope.message + ' ' + data.name; // Should log 'foo'
        })
        .error(function (data, status, headers, config) {
          //alert(data);
        });
    };
  })

/**
 * @ngdoc function
 * @name giftknacksApp.controller:AboutCtrl
 * @description
 * # Контроллер страницы "О нас"
 * Controller of the giftknacksApp
 */
  .controller('AboutCtrl', function ($scope) {
  })

/**
 * @ngdoc function
 * @name giftknacksApp.controller:DashboardCtrl
 * @description
 * # Контроллер личного кабинета
 * Controller of the giftknacksApp
 */
  .controller('DashboardCtrl', function ($scope, $rootScope) {
  });
