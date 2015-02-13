'use strict';

/**
 * @ngdoc overview
 * @name giftknacksApp
 * @description
 * # giftknacksApp
 *
 * Main module of the application.
 */
var app = angular.module( 'giftknacksApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'angular-loading-bar'] )
  .config( ['$routeProvider', '$httpProvider', function ( $routeProvider, $httpProvider ) {
  	$routeProvider
      .when( '/landing', {
      	templateUrl: '/templates/landing.html',
      	controller: 'MainCtrl'
      } )
			.when( '/login', {
				controller: 'LoginCtrl',
				templateUrl: "/templates/login.html",
				resolve: {
					confirmUser: ['authService', '$route', function ( authService, $route ) {
						var userId= $route.current.params.userId;
						if ( userId ) {
							var verify = {
								userId: userId,
								code:  $route.current.params.code
							}
							return authService.verifyEmail( verify )
						}
						else {
							return false;
						}
						
					}]
				}
			} )
			.when( "/signup", {
				controller: "SignupCtrl",
				templateUrl: "/templates/signup.html"
			} )
			.when( "/recover", {
				controller: "RecoverCtrl",
				templateUrl: "/templates/signup.html"
			} )
			.when( "/forgotpass", {
				controller: "ForgotPassCtrl",
				templateUrl: "/templates/email.html"
			} )
			.when( "/dashboard", {
				controller: "DashboardCtrl",
				templateUrl: "/templates/dashboard.html"
			} )
			.when( "/profile", {
				controller: "ProfileCtrl",
				templateUrl: "/templates/profile.html",
				resolve: {
				initialData: ['profileService', function ( profileService ) {
						return profileService.getPtofile();
					}]
				}
			} )
      .otherwise( {
      	redirectTo: '/landing'
      } );

  	$httpProvider.interceptors.push( 'authInterceptorService' );
  }] );

app.run( ['authService', function ( authService ) {
	authService.fillAuthData();

	$( function () {
		$.extend( $.inputmask.defaults.definitions, {
			'l': {
				"validator": "[A-z \.\-\]",
				"cardinality": 1,
				'prevalidator': null
			}
		} );
	} );
}] );

