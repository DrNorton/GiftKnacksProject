'use strict';
app.factory( 'authService', ['$http', '$q', 'localStorageService', function ( $http, $q, localStorageService ) {

	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';

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
	var _sendReset = function ( email ) {

		_logOut();

		return $http.post( serviceBase + 'api/account/recoverpassword', email ).then( function ( response ) {
			return response;
		} );

	};
	var _changePassword = function ( passwords ) {

		return $http.post( serviceBase + 'api/account/changepassword', passwords ).then( function ( response ) {
			return response;
		} );

	};
	var _verifyEmail = function ( data ) {

		return $http.post( serviceBase + 'api/account/verifyemail', data ).then( function ( response ) {
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

	var authServiceFactory = {
		saveRegistration: _saveRegistration,
		login: _login,
		logOut: _logOut,
		changePassword: _changePassword,
		fillAuthData: _fillAuthData,
		authentication: _authentication,
		resetPassword: _resetPassword,
		sendReset: _sendReset,
		verifyEmail: _verifyEmail
	}
	return authServiceFactory;
}] );

app.factory( "profileService", ['$http', function ( $http ) {
	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';

	var _getPtofile = function () {
		return $http.post( serviceBase + 'api/account/getprofile' ).then( function ( response ) {
			return response;
		} );
	};
	var _updatePtofile = function ( profile ) {
		return $http.post( serviceBase + 'api/account/updateprofile', profile ).then( function ( response ) {
			return response;
		} );
	};

	var profileServiceFactory = {
		getPtofile: _getPtofile,
		updatePtofile: _updatePtofile
	};
	return profileServiceFactory;
}] );

app.factory( 'authInterceptorService', ['$q', '$location', 'localStorageService', function ( $q, $location, localStorageService ) {

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

	var authInterceptorServiceFactory = {
		request: _request,
		responseError: _responseError
	};
	return authInterceptorServiceFactory;
	
}] );

app.factory( 'commonService', [ function (  ) {

	var _displayError = function ( response) {
		var errors = [];
		for ( var key in response.data.modelState ) {
			for ( var i = 0; i < response.data.modelState[key].length; i++ ) {
				errors.push( response.data.modelState[key][i] );
			}
		}
		var msg = errors.length ? errors.join( ' ' ) : response.data.message;
		return msg;
	}

	var commonServiceFactory = {
		displayError: _displayError
	};
	return commonServiceFactory;

}] );