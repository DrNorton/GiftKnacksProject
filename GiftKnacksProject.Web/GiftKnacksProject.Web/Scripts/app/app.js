'use strict';

/**
 * @ngdoc overview
 * @name giftknacksApp
 * @description
 * # giftknacksApp
 *
 * Main module of the application.
 */
angular
  .module( 'giftknacksApp', ['ngRoute', 'ui.bootstrap'] )
  .config(['$routeProvider', function ($routeProvider) {
  	$routeProvider
      .when('/', {
      	templateUrl: '/templates/landing.html',
      	controller: 'MainCtrl'
      })
      .otherwise({
      	redirectTo: '/'
      });
  }])
.controller('RootController', ['$scope', function ( $scope ) {
}]);

