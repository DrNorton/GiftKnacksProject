'use strict';

app.factory('authService', ['$http', '$q', 'localStorageService', 'serviceBase', function ($http, $q, localStorageService, serviceBase) {

	var _authentication = {
		isAuth: false,
		userName: "",
		isFilled: false,
		userId: '',
        token:''
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

		    localStorageService.set( 'authorizationData', { token: response.access_token, userName: loginData.userName, isFilled: response.isFilled, userId:response.userId } );

			_authentication.isAuth = true;
			_authentication.userName = loginData.userName;
			_authentication.isFilled = response.isFilled;
			_authentication.userId = response.userId;
			_authentication.token = response.access_token;

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
		_authentication.userId = '';
		_authentication.token = '';

	};

	var _fillAuthData = function () {

		var authData = localStorageService.get( 'authorizationData' );
		if ( authData ) {
			_authentication.isAuth = true;
			_authentication.userName = authData.userName;
			_authentication.isFilled = authData.isFilled;
			_authentication.userId = authData.userId;
			_authentication.token = authData.token;
		}

	}
	var _setIsFilled = function ( value ) {
		_authentication.isFilled = value;
		var authData = localStorageService.get( 'authorizationData' );
		if ( authData ) {
		    localStorageService.set('authorizationData', { token: authData.token, userName: authData.userName, isFilled: value, userId: authData.userId });
		}
		
	}

	var _findUsers = function (query) {

	    return $http.post(serviceBase + 'api/account/search', query).then(function (response) {
	        return response;
	    });

	};
	var _checkActivity = function () {

	    return $http.post(serviceBase + 'api/account/checkactivity').then(function (response) {
	        return response;
	    });

	};
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
		setIsFilled: _setIsFilled,
		findUsers: _findUsers,
		checkActivity: _checkActivity

	}
	return authServiceFactory;
}] );

app.factory("profileService", ['$http', 'serviceBase', function ($http, serviceBase) {

	var _getPtofile = function (id) {
		return $http.post( serviceBase + 'api/account/getprofile', {'Id':id} ).then( function ( response ) {
			return response;
		} );
	};
	var _getShortPtofile = function ( id ) {
		return $http.post( serviceBase + 'api/account/getshortprofile', { 'Id': id } ).then( function ( response ) {
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
		getShortPtofile: _getShortPtofile,
		updatePtofile: _updatePtofile
	};
	return profileServiceFactory;
}] );

app.factory("wishAndGiftService", ['$http', 'serviceBase', function ($http, serviceBase) {

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
	    return $http.post(serviceBase + 'api/interestingnear/near').then(function (response) {
	        return response;
	    });
	};

	var _showGifts = function (query) {
	    return $http.post(serviceBase + 'api/gift/getbyuser', query).then(function (response) {
			return response;
		} );
	};

	var _showWishes = function (query) {
	    return $http.post(serviceBase + 'api/wish/getbyuser', query).then(function (response) {
			return response;
		} );
	};
	var _linkWishAndGift = function (wish, gift) {
		return $http.post( serviceBase + 'api/linker/link', { 'WishId': wish, 'GiftId': gift } ).then( function ( response ) {
			return response;
		} );
	};
	var _closeWish = function (query) {
	    return $http.post(serviceBase + 'api/wish/close', query).then(function (response) {
	        return response;
	    });
	};
	var _closeGift = function (query) {
	    return $http.post(serviceBase + 'api/gift/close', query).then(function (response) {
	        return response;
	    });
	};

	var _setReturnPoint = function ( itemtype, itemid ) {
		var response = null;
		if ( itemtype && itemid >= 0 ) {
			response = {
				itemtype: itemtype,
				itemid: itemid
			}
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
		showGifts: _showGifts,
		showWishes: _showWishes,
		linkWishAndGift: _linkWishAndGift,
		closeWish: _closeWish,
		closeGift: _closeGift,
		setReturnPoint: _setReturnPoint
	};
	return wishAndGiftServiceFactory;
}] );

app.factory('feedService', ['$http', 'serviceBase', function ($http, serviceBase) {
    var _getFeed = function (query) {
       
        return $http.post(serviceBase + 'api/lenta/getlenta', query).then(function (response) {
            var res = {};
            res.data= {
                "ErrorCode": 0,
                "ErrorMessage": null,
                "Result": [
                    {
                        "Action": "join",
                        "Time": "2015-10-24T15:49:48.97622",
                        "Info": {
                            TargetType: 'wish',
                            User: { "Id": '168', "FirstName": 'bk', "LastName": 'lkhk' },
                            Target: { "Id": 20, "Title": "wish22" }
                        }
                    },
                    {
                        "Action": "addcomment",
                        "Time": "2015-10-18T17:31:50.742444",
                        "Info": {
                            TargetType: 'wish',
                            User: { "Id": '168', "FirstName": 'bk', "LastName": 'lkhk' },
                            Target: { "Id": 20, "Title": "wish22" }
                        }
                    },
                    {
                        "Action": "addreference",
                        "Time": "2015-10-18T17:31:02.094518",
                        "Info": {
                            User: { "Id": '168', "FirstName": 'bk', "LastName": 'lkhk' },
                            Target: { "Id": '165', Score: '5' }
                        }
                    },
                    {
                        "Action": "closejoineditem",
                        "Time": "2015-10-18T17:30:51.340553",
                        "Info": {
                            TargetType: 'wish',
                            Target: { "Id": 20, "Title": "wish22" }
                        }
                    }
                ]
            };
            return res;
             return response;
         });
    };

    var feedServiceFactory = {
        getFeed: _getFeed
    };
    return feedServiceFactory;

}]);

app.factory('authInterceptorService', ['$q', '$location', 'localStorageService', 'serviceBase', function ($q, $location, localStorageService, serviceBase) {

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

app.factory('commonService', ['$http', 'serviceBase', function ($http, serviceBase) {

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

}]);

app.factory('referenceService', ['$http', 'serviceBase', function ($http, serviceBase) {
    var _addReference = function (reference) {
        return $http.post(serviceBase + 'api/reference/add', reference).then(function (response) {
            return response;
        });
    };
    var _getReferences = function (id) {
        return $http.post(serviceBase + 'api/reference/getall', { Id: id }).then(function (response) {
            return response;
        });
    };

    var referenceServiceFactory = {
        addReference: _addReference,
        getReferences: _getReferences
    };
    return referenceServiceFactory;

}]);

app.factory('commentService', ['$http', 'serviceBase', function ($http, serviceBase) {
    var _addWishComment = function (query) {
        return $http.post(serviceBase + 'api/comment/addtowish', query).then(function (response) {
            return response;
        });
    };
    var _addGiftComment = function (query) {
        return $http.post(serviceBase + 'api/comment/addtogift', query).then(function (response) {
            return response;
        });
    };
    var _getWishComments = function (id) {
        return $http.post(serviceBase + 'api/comment/getbywishid', { Id: id }).then(function (response) {
            return response;
        });
    };
    var _getGiftComments = function (id) {
        return $http.post(serviceBase + 'api/comment/getbygiftid', { Id: id }).then(function (response) {
            return response;
        });
    };

    var referenceServiceFactory = {
        addWishComment: _addWishComment,
        addGiftComment: _addGiftComment,
        getWishComments: _getWishComments,
        getGiftComments: _getGiftComments
    };
    return referenceServiceFactory;

}]);

app.factory('geoService', ['$http', 'serviceBase', function ($http, serviceBase) {
	var _getCountry = function ( val ) {
		return $http.get( serviceBase + 'api/country').then( function ( response ) {
			return response;
		} );
	};

	var geoServiceFactory = {
		getCountry: _getCountry
	};
	return geoServiceFactory;

}]);

app.factory('signalRHubProxy', ['$rootScope', 'authService', 'serviceBase', function ($rootScope, authService, serviceBase) {

    function signalRHubProxyFactory(serverUrl, hubName, startOptions) {
            var connection = $.hubConnection(serviceBase + 'signalr', { useDefaultPath: false });
            connection.qs = { 'access_token': authService.authentication.token };
            var proxy = connection.createHubProxy(hubName);
            proxy.on('onConnected', function () { console.log(hubName + " connected"); });
            var startPromise = connection.start(startOptions);

            return {
                on: function (eventName, callback) {
                    proxy.on(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                off: function (eventName, callback) {
                    proxy.off(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                invoke: function (methodName, callback) {
                    proxy.invoke(methodName)
                        .done(function (result) {
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback(result);
                                }
                            });
                        });
                },
                connection: connection,
                startPromise: startPromise
            };
        };

        return signalRHubProxyFactory;
}]);
