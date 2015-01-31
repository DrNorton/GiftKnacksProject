'use strict';

/**
 * @ngdoc function
 * @name giftknacksApp.factory:AuthService
 * @description
 * Сервис аутентификации
 * factory of the giftknacksApp
 */
angular.module('giftknacksApp')
  .factory('AuthService', function ($http, URLS) {
    var authUrl = URLS.serviceBase+ 'auth/';
    var authService = {};

    authService.access = function (credentials, action) {
      return $http
        .post(authUrl + action, credentials)
        .then(function (res) {
          return res.data;
        });
    };

    return authService;
  })

/**
 * @ngdoc function
 * @name giftknacksApp.factory:AuthInterceptor
 * @description
 * Сервис проверки авторизации пользователя
 * factory of the giftknacksApp
 */
  .factory('AuthInterceptor', function ($rootScope, $q, $window, $location) {
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
  $httpProvider.interceptors.push('AuthInterceptor');
});

