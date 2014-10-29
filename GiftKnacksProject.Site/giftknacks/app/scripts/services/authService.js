'use strict';
angular.module('giftknacksApp')
  .factory('AuthService', function ($http, URLS) {
    var baseUrl = URLS.serviceBase;
    var authService = {};

    authService.signup = function (credentials) {
      return $http
        .post(URLS.serviceBase + 'api/auth/register', credentials)
        .then(function (res) {
          return res.data;
        });
    };
    authService.login = function (credentials) {
      return $http
        .post(URLS.serviceBase + 'api/auth/login', credentials)
        .then(function (res) {
          return res.data;
        });
    };

    return authService;
  });

//TODO перенести в отдельный файл
angular.module('giftknacksApp')
  .factory('authInterceptor', function ($rootScope, $q, $window, $location) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
// handle the case where the user is not authenticated
          $location.url('/login');
        }
        return $q.reject(rejection);
      }
    };
  });
angular.module('giftknacksApp').config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

