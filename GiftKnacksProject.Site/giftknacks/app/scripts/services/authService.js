'use strict';
angular.module('giftknacksApp')
  .factory('authService', ['$http', '$q', function ($http, $q) {

  var serviceBase = 'http://giftknacksproject.azurewebsites.net/';
  var authServiceFactory = {};

  var _authentication = {
    isAuth: false,
    userName : ""
  };

  var _saveRegistration = function (registration) {

    _logOut();

    return $http.post(serviceBase + 'api/auth/register', registration).then(function (response) {
      return response;
    });

  };

  var _login = function (loginData) {

    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

    var deferred = $q.defer();

    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

      _authentication.isAuth = true;
      _authentication.userName = loginData.userName;

      deferred.resolve(response);

    }).error(function (err, status) {
      _logOut();
      deferred.reject(err);
    });

    return deferred.promise;

  };

  var _logOut = function () {

    _authentication.isAuth = false;
    _authentication.userName = "";

  };

  var _fillAuthData = function () {

    if (authData)
    {
      _authentication.isAuth = true;
      _authentication.userName = authData.userName;
    }

  }

  authServiceFactory.saveRegistration = _saveRegistration;
  authServiceFactory.login = _login;
  authServiceFactory.logOut = _logOut;
  authServiceFactory.fillAuthData = _fillAuthData;
  authServiceFactory.authentication = _authentication;

  return authServiceFactory;
}]);
