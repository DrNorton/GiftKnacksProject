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
app.controller( 'ProfileCtrl', ['$scope', '$location', '$timeout', 'authService', function ( $scope, $location, $timeout, authService ) {
	$scope.passwordSavedSuccessfully = false;
	$scope.emailSavedSuccessfully = false;
	$scope.profileSavedSuccessfully = false;
	$scope.passwordMessage = "";
	$scope.emailMessage = "";
	$scope.profileMessage = "";
	$scope.openBio = false;

	$scope.passwordData = {
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	};
	$scope.emailData = {
		newEmail: ""
	};
	$scope.profile = {
		name: 'val',
		surname: 'Kurashova',
		birthday: '02.12.1991',
		hideBirthday:true,
		country: 'Russia',
		city: 'Moscow',
		skype: 'extrudedwad',
		facebook: '',
		vk: '',
		mainContact: 'email',
		bio: 'nyasha'
	};
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
		 	$scope.emailMessage = "Failed to change email user due to:" + errors.join( ' ' );
		 } );
	};

	$scope.changePassword = function () {

		authService.changePassword( $scope.passwordData ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.passwordSavedSuccessfully = true;
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
		 	$scope.passwordMessage = "Failed to change password user due to:" + errors.join( ' ' );
		 } );
	};
	$scope.changeProfile = function () {
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

	$scope.registration = {
		email: "",
		password: "",
		confirmPassword: ""
	};

	$scope.signUp = function () {

		authService.saveRegistration( $scope.registration ).then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				$scope.savedSuccessfully = true;
				$scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
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
		 	$scope.message = "Failed to register user due to:" + errors.join( ' ' );
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