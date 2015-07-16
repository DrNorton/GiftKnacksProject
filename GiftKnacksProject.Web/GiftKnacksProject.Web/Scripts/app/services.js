'use strict';
app.factory( 'authService', ['$http', '$q', 'localStorageService', function ( $http, $q, localStorageService ) {

	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';

	var _authentication = {
		isAuth: false,
		userName: "",
		isFilled:false
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

			localStorageService.set( 'authorizationData', { token: response.access_token, userName: loginData.userName, isFilled: response.isFilled } );

			_authentication.isAuth = true;
			_authentication.userName = loginData.userName;
			_authentication.isFilled = response.isFilled;

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
		_authentication.isFilled = false;

	};

	var _fillAuthData = function () {

		var authData = localStorageService.get( 'authorizationData' );
		if ( authData ) {
			_authentication.isAuth = true;
			_authentication.userName = authData.userName;
			_authentication.isFilled = authData.isFilled;
		}

	}
	var _setIsFilled = function ( value ) {
		_authentication.isFilled = value;
		var authData = localStorageService.get( 'authorizationData' );
		if ( authData ) {
			localStorageService.set( 'authorizationData', { token: authData.token, userName: authData.userName, isFilled: value } );
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
		verifyEmail: _verifyEmail,
		setIsFilled: _setIsFilled

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

app.factory( "wishAndGiftService", ['$http', function ( $http ) {
	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';

	var _getEmptyWish = function () {
		return $http.post( serviceBase + 'api/wish/getemptywish' ).then( function ( response ) {
			return response;
		} );
	};
	var _addWish = function ( wish ) {
		return $http.post( serviceBase + 'api/wish/addwish', wish ).then( function ( response ) {
			return response;
		} );
	};
	var _getEmptyGift = function () {
		return $http.post( serviceBase + 'api/gift/getemptygift' ).then( function ( response ) {
			return response;
		} );
	};
	var _addGift = function ( gift ) {
		return $http.post( serviceBase + 'api/gift/addgift', gift ).then( function ( response ) {
			return response;
		} );
	};
	var _getGifts = function ( query ) {
		return $http.post( serviceBase + 'api/gift/getall', query ).then( function ( response ) {
			return response;
		} );
	};
	var _getWishes = function ( query ) {
		return $http.post( serviceBase + 'api/wish/getall', query ).then( function ( response ) {
			return response;
		} );
	};
	var _getGiftById = function ( id ) {
		return $http.post( serviceBase + 'api/gift/get', { 'id': id } ).then( function ( response ) {
			return response;
		} );

	};

	var _getWishById = function ( id ) {
		return $http.post( serviceBase + 'api/wish/get', { 'id': id } ).then( function ( response ) {
			return response;
		} );

	};

	var _getInterestingActivities = function () {
		var response = {
			data: {
				Result:
					{
						Wishes: [
						'chocolate Alenka', 'Sushki', 'Car toy'
						],
						Gifts: [
							'gift1', 'gift2', 'gift3'
						],
						Members: [
							'Vasya', 'Masha'
						]
					}
			}
		}
		return response;
	};
	var _getHistory = function () {
		var response = {
			data: {
				Result:
					{
						Wishes: [
					'Surprise', 'Soy milk', 'Bear toy'
						],
						Gifts: [
							'Russia trip', 'Euro trip'
						]
					}
			}
		};
		if ( !Math.floor( Math.random() * 2 ) ) {
			response.data = null;
		}

		return response;
	};

	var _showMyGifts = function () {
		return $http.post( serviceBase + 'api/gift/getmygifts' ).then( function ( response ) {
			return response;
		} );
	};

	var _showMyWishes = function () {
		return $http.post( serviceBase + 'api/wish/getmywishes' ).then( function ( response ) {
			return response;
		} );
	};
	var _linkWishAndGift = function (wish, gift) {
		return $http.post( serviceBase + 'api/linker/link', { 'WishId': wish, 'GiftId': gift } ).then( function ( response ) {
			return response;
		} );
	};
	var _setReturnPoint = function ( itemtype, itemid ) {
		var response = '';
		if ( itemtype && itemid>=0 ) {
			response = itemtype + '/' + itemid;
		}
		return response;
	};

	var wishAndGiftServiceFactory = {
		getEmptyWish: _getEmptyWish,
		addWish: _addWish,
		getEmptyGift: _getEmptyGift,
		addGift: _addGift,
		getGifts: _getGifts,
		getWishes: _getWishes,
		getGiftById: _getGiftById,
		getWishById: _getWishById,
		getInterestingActivities: _getInterestingActivities,
		getHistory: _getHistory,
		showMyGifts: _showMyGifts,
		showMyWishes: _showMyWishes,
		linkWishAndGift: _linkWishAndGift,
		setReturnPoint: _setReturnPoint
	};
	return wishAndGiftServiceFactory;
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

app.factory( 'commonService', ['$http', function ( $http ) {

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

app.factory( 'geoService', ['$http', function ( $http ) {
	var serviceBase = 'http://giftknacksproject.azurewebsites.net/';
	var _getCountry = function ( val ) {
		return $http.get( serviceBase + 'api/country').then( function ( response ) {
			return response;
		} );
	};

	var geoServiceFactory = {
		getCountry: _getCountry
	};
	return geoServiceFactory;

}] );