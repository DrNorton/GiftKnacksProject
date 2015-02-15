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
						var userId = $route.current.params.userId;
						if ( userId ) {
							var verify = {
								userId: userId,
								code: $route.current.params.code
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
			.when( "/wishform", {
				controller: "WishFormCtrl",
				templateUrl: "/templates/wishform.html",
				resolve: {
					initialData: ['wishAndGiftService', function ( wishAndGiftService ) {
						return wishAndGiftService.getEmptyWish();
					}],
					countries: ['geoService', function ( geoService ) {
						return geoService.getCountry();
					}]
				}
			} )
			.when( "/profile", {
				controller: "ProfileCtrl",
				templateUrl: "/templates/profile.html",
				resolve: {
					initialData: ['profileService', function ( profileService ) {
						return profileService.getPtofile();
					}],
					countries: ['geoService', function ( geoService ) {
						return geoService.getCountry();
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

	if ( !String.prototype.startsWith ) {
		Object.defineProperty( String.prototype, 'startsWith', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: function ( searchString, position ) {
				position = position || 0;
				return this.lastIndexOf( searchString, position ) === position;
			}
		} );
	}
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

