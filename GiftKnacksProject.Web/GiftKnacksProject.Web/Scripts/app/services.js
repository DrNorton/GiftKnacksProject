'use strict';
app.factory( 'authService', ['$http', '$q', 'localStorageService', function ( $http, $q, localStorageService ) {

	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';
	var authServiceFactory = {};

	var _authentication = {
		isAuth: false,
		userName: ""
	};

	var _saveRegistration = function ( registration ) {

		_logOut();

		return $http.post( serviceBase + 'api/account/register', registration ).then( function ( response ) {
			return response;
		} );

	};

	var _resetPassword = function ( registration ) {

		_logOut();

		return $http.post( serviceBase + 'api/account/resetpassword', registration ).then( function ( response ) {
			return response;
		} );

	};

	var _changePassword = function ( passwords ) {

		return $http.post( serviceBase + 'api/account/changepassword', passwords ).then( function ( response ) {
			return response;
		} );

	};

	var _changeEmail = function ( email ) {

		return $http.post( serviceBase + 'api/account/changeemail', email ).then( function ( response ) {
			return response;
		} );

	};

	var _login = function ( loginData ) {

		var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

		var deferred = $q.defer();

		$http.post( serviceBase + 'api/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } ).success( function ( response ) {

			localStorageService.set( 'authorizationData', { token: response.access_token, userName: loginData.userName } );

			_authentication.isAuth = true;
			_authentication.userName = loginData.userName;

			deferred.resolve( response );

		} ).error( function ( err, status ) {
			_logOut();
			deferred.reject( err );
		} );

		return deferred.promise;

	};

	var _logOut = function () {

		localStorageService.remove( 'authorizationData' );

		_authentication.isAuth = false;
		_authentication.userName = "";

	};

	var _fillAuthData = function () {

		var authData = localStorageService.get( 'authorizationData' );
		if ( authData ) {
			_authentication.isAuth = true;
			_authentication.userName = authData.userName;
		}

	}

	authServiceFactory.saveRegistration = _saveRegistration;
	authServiceFactory.login = _login;
	authServiceFactory.logOut = _logOut;
	authServiceFactory.changePassword = _changePassword;
	authServiceFactory.changeEmail = _changeEmail;
	authServiceFactory.fillAuthData = _fillAuthData;
	authServiceFactory.authentication = _authentication;
	authServiceFactory.resetPassword = _resetPassword;

	return authServiceFactory;
}] );

app.factory( "profileService", ['$http', function ( $http ) {
	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';
	var profileServiceFactory = {};

	var _getPtofile = function () {
		return $http.post( serviceBase + 'api/account/getprofile' ).then( function ( response ) {
			return response;
		} );
	};
	var _updatePtofile = function (profile) {
		return $http.post( serviceBase + 'api/account/updateprofile', profile ).then( function ( response ) {
			return response;
		} );
	};

	profileServiceFactory.getPtofile = _getPtofile;
	profileServiceFactory.updatePtofile = _updatePtofile;
	return profileServiceFactory;
}] );

app.factory( 'authInterceptorService', ['$q', '$location', 'localStorageService', function ( $q, $location, localStorageService ) {

	var authInterceptorServiceFactory = {};

	var _request = function ( config ) {

		config.headers = config.headers || {};

		var authData = localStorageService.get( 'authorizationData' );
		if ( authData ) {
			config.headers.Authorization = 'Bearer ' + authData.token;
		}

		return config;
	}

	var _responseError = function ( rejection ) {
		if ( rejection.status === 401 ) {
			$location.path( '/login' );
		}
		return $q.reject( rejection );
	}

	authInterceptorServiceFactory.request = _request;
	authInterceptorServiceFactory.responseError = _responseError;

	return authInterceptorServiceFactory;
}] );