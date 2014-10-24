'use strict';
angular.module('giftknacksApp')
  .factory('AuthService', function ($http, Session) {

    var serviceBase = 'http://localhost:1337/';
    var authService = {};

    authService.signup = function (credentials) {
      return $http
        .post(serviceBase + 'api/auth/register', credentials)
        .then(function (res) {
          return res.data;
        });
    };

    authService.login = function (credentials) {
      return $http
        .post('/login', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.user.id,
            res.data.user.role);
          return res.data.user;
        });
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;
  });




  /*.factory('authServiceOld', ['$http', '$q', function ($http, $q) {

    var serviceBase = 'http://localhost:1337/';
    var authServiceFactory = {};

    var _authentication = {
      isAuth: false,
      userName: ""
    };

    var _saveRegistration = function (registration) {

      _logOut();

      return $http.post(serviceBase + 'api/auth/register', registration).then(function (response) {
        return response.data;
      });

    };

    var _login = function (loginData) {

      var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

      var deferred = $q.defer();

      $http.post(serviceBase + 'token', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).success(function (response) {

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

      if (authData) {
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
  }]);*/
