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
app.controller( 'ProfileCtrl', ['$scope', '$location', '$timeout', 'authService', 'profileService', 'initialData','commonService', function ( $scope, $location, $timeout, authService,profileService, initialData, commonService ) {
	$scope.passwordSavedSuccessfully = false;
	$scope.emailSavedSuccessfully = false;
	$scope.profileSavedSuccessfully = false;
	$scope.profileGetSuccessfully = false;
	$scope.passwordMessage = "";
	$scope.emailMessage = "";
	$scope.profileMessage = "";
	$scope.profileGetMessage = "";
	$scope.openBio = false;
	$scope.newContact = 'new';

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

		//обработка массива контактов
		for ( var i = 0; i < $scope.profile.Contacts.length; i++ ) {
			var contact=$scope.profile.Contacts[i];
			if (contact.MainContact) {
				$scope.profile.MainContact = contact.Name;
			}
			//удаление из списка всех контактов тех, которые уже есть
			var index = $scope.profile.ContactTypes.indexOf( contact.Name );
			if ( index>-1 ) {
				$scope.profile.ContactTypes.splice( index, 1 );
			}
		}
	}
	else {
		$scope.profileGetMessage = "Failed to get user data:" + initialData.data.ErrorMessage;
		$scope.profileGetSuccessfully = false;
	}
	//выбрать главный контакт
	$scope.chooseMainContact = function ( name ) {
		for ( var i = 0; i < $scope.profile.Contacts.length; i++ ) {
			var contact = $scope.profile.Contacts[i];
			contact.MainContact = contact.Name === name;
		}
	}
	//добавит контакт из списка
	$scope.updateContacts = function () {
		var index = $scope.profile.ContactTypes.indexOf( $scope.newContact );
		$scope.profile.ContactTypes.splice( index, 1 );
		$scope.profile.Contacts.push( { Name: $scope.newContact, Value: '', MainContact: false } );
		$scope.newContact = 'new';
	}
	$scope.authentication = authService.authentication;

	//обноление пароля
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
		 
		 	$scope.passwordSavedSuccessfully = false;
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
		},		 function ( response ) {
		 	$scope.profileSavedSuccessfully = false;
		 	$scope.profileMessage = "Failed to save profile due to: " + commonService.displayError;
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
app.controller( 'SignupCtrl', ['$scope', '$location', '$timeout', 'authService', 'commonService', function ( $scope, $location, $timeout, authService, commonService ) {

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
			

		}, function ( response ) {
		 	$scope.savedSuccessfully = false;
		 	$scope.message = "Failed to register user due to:" + commonService.displayError;
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
app.controller( 'LoginCtrl', ['$scope', '$location', 'authService', 'confirmUser', '$routeParams', function ( $scope, $location, authService, confirmUser, $routeParams ) {
	authService.logOut();
	var email = $routeParams.email || '';
	$scope.loginData = {
		userName: email,
		password: ""
	};

	$scope.message = "";

	$scope.login = function () {

		authService.login( $scope.loginData ).then( function ( response ) {
			$location.url( $location.path() );
			$location.path( '/dashboard' );

		},
		 function ( err ) {
		 	$scope.message = err.error_description;
		 } );
	};

}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ForgotPassCtrl
 * @description
 * # Контроллер отправки email для восстановления пароля
 * Controller of the giftknacksApp
 */
app.controller( 'ForgotPassCtrl', ['$scope', '$location', 'authService', function ( $scope, $location, authService ) {
	authService.logOut();
	$scope.sent = false;
	$scope.email = {
		email: ""
	};

	$scope.message = "";

	$scope.sendReset = function () {

		authService.sendReset( $scope.email ).then( function ( response ) {
			$scope.sent = true;
			$scope.message = 'We sent you a reset instructions to ' + $scope.email.email;

		},
		 function ( err ) {
		 	$scope.sent = false;
		 	$scope.message = err.error_description;
		 } );
	};

}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:RecoverCtrl
 * @description
 * # Контроллер восстановления пароля
 * Controller of the giftknacksApp
 */
app.controller( 'RecoverCtrl', ['$scope', '$location', '$timeout','$routeParams', 'authService', 'commonService', function ( $scope, $location, $timeout, $routeParams, authService, commonService ) {
	$scope.token = $routeParams.token;
	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.title = 'Reset password';


	$scope.registration = {
		email: $routeParams.email,
		password: "",
		confirmPassword: "",
		code: $routeParams.token
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


		}, function ( response ) {
		 	$scope.savedSuccessfully = false;
		 	$scope.message = "Failed to reset password due to:" + commonService.displayError;
		 } );
	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.search( 'token', null );
			$location.path( '/login' );
		}, 2000 );
	}

}] );