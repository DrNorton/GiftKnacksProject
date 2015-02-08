'use strict';
/**
 * @ngdoc function
 * @name giftknacksApp.controller:RootCtrl
 * @description
 * # Контроллер всего приложения
 * Controller of the giftknacksApp
 */
app.controller( 'RootCtrl', ['$scope', '$location', 'authService', function ( $scope, $location, authService ) {

	$scope.logOut = function () {
		authService.logOut();
		$location.path( '/landing' );
	}

	$scope.authentication = authService.authentication;
	$scope.$on('$locationChangeStart', function (event, next, current) {
		if ( next!==current &&current.indexOf( 'profile' ) > -1 ) {
			var answer = confirm('Are you sure you want to leave this page?');
			if (!answer) {
				event.preventDefault();
			}
		}    
	});
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:MainCtrl
 * @description
 * # Контроллер главной страницы
 * Controller of the giftknacksApp
 */
app.controller( 'MainCtrl', function ( $scope ) {
} );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:DashboardCtrl
 * @description
 * # Контроллер страницы с последней активностью пользователя
 * Controller of the giftknacksApp
 */
app.controller( 'DashboardCtrl', ['$scope', function ( $scope) {

	//ordersService.getOrders().then( function ( results ) {	}, function ( error ) {	} );
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ProfileCtrl
 * @description
 * # Контроллер профиля
 * Controller of the giftknacksApp
 */
app.controller( 'ProfileCtrl', ['$scope', '$location', '$timeout', 'authService', 'profileService', 'initialData', function ( $scope, $location, $timeout, authService,profileService, initialData ) {
	$scope.passwordSavedSuccessfully = false;
	$scope.emailSavedSuccessfully = false;
	$scope.profileSavedSuccessfully = false;
	$scope.profileGetSuccessfully = false;
	$scope.passwordMessage = "";
	$scope.emailMessage = "";
	$scope.profileMessage = "";
	$scope.profileGetMessage = "";
	$scope.openBio = false;

	$scope.passwordData = {
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	};
	$scope.emailData = {
		newEmail: ""
	};
	$scope.profile = {};

	//если данные профиля получены
	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.profile = initialData.data.Result;
		$scope.profileGetMessage = "";
		$scope.profileGetSuccessfully = true;
	} else {
		$scope.profileGetMessage = "Failed to get user data:" + initialData.data.ErrorMessage;
		$scope.profileGetSuccessfully = false;
	}
	
	$scope.authentication = authService.authentication;

	$scope.changeEmail = function () {

		authService.changeEmail( $scope.emailData ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.emailSavedSuccessfully = true;
				$scope.emailMessage = "Email has been changed successfully, you will be redicted to login page in 2 seconds.";
				startTimer();
			} else {
				$scope.emailSavedSuccessfully = false;
				$scope.emailMessage = response.data.ErrorMessage;
			}
		},
		 function ( response ) {
		 	var errors = [];
		 	for ( var key in response.data.modelState ) {
		 		for ( var i = 0; i < response.data.modelState[key].length; i++ ) {
		 			errors.push( response.data.modelState[key][i] );
		 		}
		 	}
		 	$scope.emailSavedSuccessfully = false;
		 	var msg = errors.length ? errors.join( ' ' ) : response.data.message;
		 	$scope.emailMessage = "Failed to change email user due to:" + msg;
		 } );
	};

	$scope.changePassword = function () {

		authService.changePassword( $scope.passwordData ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.passwordSavedSuccessfully = true;
				$scope.passwordData = {
					oldPassword: "",
					newPassword: "",
					confirmNewPassword: ""
				};
				$scope.passwordMessage = "Password has been changed successfully.";
			} else {
				$scope.passwordSavedSuccessfully = false;
				$scope.passwordMessage = response.data.ErrorMessage;
			}
		},
		 function ( response ) {
		 	var errors = [];
		 	for ( var key in response.data.modelState ) {
		 		for ( var i = 0; i < response.data.modelState[key].length; i++ ) {
		 			errors.push( response.data.modelState[key][i] );
		 		}
		 	}
		 	$scope.passwordSavedSuccessfully = false;
		 	var msg = errors.length ? errors.join( ' ' ) : response.data.message;
		 	$scope.passwordMessage = "Failed to change password user due to:" + msg;
		 } );
	};

	$scope.updatePtofile = function () {
		profileService.updatePtofile( $scope.profile ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.profileSavedSuccessfully = true;
				$scope.profileMessage = "Profile has been saved successfully.";
			} else {
				$scope.profileSavedSuccessfully = false;
				$scope.profileMessage = response.data.ErrorMessage;
			}
		},
		 function ( response ) {
		 	var errors = [];
		 	for ( var key in response.data.modelState ) {
		 		for ( var i = 0; i < response.data.modelState[key].length; i++ ) {
		 			errors.push( response.data.modelState[key][i] );
		 		}
		 	}
		 	$scope.profileSavedSuccessfully = false;
		 	var msg = errors.length ? errors.join( ' ' ) : response.data.message;
		 	$scope.profileMessage = "Failed to save profile due to: " + msg;
		 } );
	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.path( '/login' );
		}, 2000 );
	}
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:SignupCtrl
 * @description
 * # Контроллер регистрации
 * Controller of the giftknacksApp
 */
app.controller( 'SignupCtrl', ['$scope', '$location', '$timeout', 'authService', function ( $scope, $location, $timeout, authService ) {

	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.title = 'Sign Up';


	$scope.registration = {
		email: "",
		password: "",
		confirmPassword: ""
	};

	$scope.submit = function () {

		authService.saveRegistration( $scope.registration ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.savedSuccessfully = true;
				$scope.message = "Thanks for signing up on KnacksGifter! We just sent you a confirmation email to " + $scope.registration.email + ". You will be redicted to home page in 10 seconds.";
				startTimer();
			} else {
				$scope.savedSuccessfully = false;
				$scope.message = response.data.ErrorMessage;
			}
			

		},
		 function ( response ) {
		 	var errors = [];
		 	for ( var key in response.data.modelState ) {
		 		for ( var i = 0; i < response.data.modelState[key].length; i++ ) {
		 			errors.push( response.data.modelState[key][i] );
		 		}
		 	}
		 	$scope.savedSuccessfully = false;
		 	var msg = errors.length ? errors.join( ' ' ) : response.data.message;
		 	$scope.message = "Failed to register user due to:" + msg;
		 } );
	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.path( '/landing' );
		}, 10000 );
	}

}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:LoginCtrl
 * @description
 * # Контроллер авторизации
 * Controller of the giftknacksApp
 */
app.controller( 'LoginCtrl', ['$scope', '$location', 'authService', function ( $scope, $location, authService ) {
	authService.logOut();

	$scope.loginData = {
		userName: "",
		password: ""
	};

	$scope.message = "";

	$scope.login = function () {

		authService.login( $scope.loginData ).then( function ( response ) {

			$location.path( '/dashboard' );

		},
		 function ( err ) {
		 	$scope.message = err.error_description;
		 } );
	};

}] );


/**
 * @ngdoc function
 * @name giftknacksApp.controller:RecoverCtrl
 * @description
 * # Контроллер восстановления пораля
 * Controller of the giftknacksApp
 */
app.controller( 'RecoverCtrl', ['$scope', '$location', '$timeout', 'authService', function ( $scope, $location, $timeout, authService ) {

	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.title = 'Reset password';


	$scope.registration = {
		email: "",
		password: "",
		confirmPassword: ""
	};
	//TODO: parse href for email and token 
	$scope.submit = function () {

		authService.resetPassword( $scope.registration ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.savedSuccessfully = true;
				$scope.message = "Your password was reset. You will be redicted to login page in 2 seconds.";
				startTimer();
			} else {
				$scope.savedSuccessfully = false;
				$scope.message = response.data.ErrorMessage;
			}


		},
		 function ( response ) {
		 	var errors = [];
		 	for ( var key in response.data.modelState ) {
		 		for ( var i = 0; i < response.data.modelState[key].length; i++ ) {
		 			errors.push( response.data.modelState[key][i] );
		 		}
		 	}
		 	$scope.savedSuccessfully = false;
		 	var msg = errors.length ? errors.join( ' ' ) : response.data.message;
		 	$scope.message = "Failed to reset password due to:" + msg;
		 } );
	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.path( '/login' );
		}, 2000 );
	}

}] );