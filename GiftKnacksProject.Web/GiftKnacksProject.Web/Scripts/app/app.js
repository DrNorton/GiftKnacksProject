'use strict';

/**
 * @ngdoc overview
 * @name giftknacksApp
 * @description
 * # giftknacksApp
 *
 * Main module of the application.
 */
var app = angular.module('giftknacksApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'angular-loading-bar', 'infinite-scroll'])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
      $routeProvider
           .when('/signalr', {
               templateUrl: '/templates/signalr.html',
               controller: 'myCtrl'
           })
        .when('/landing', {
            templateUrl: '/templates/landing.html',
            controller: 'MainCtrl'
        })
           .when('/faq', {
               templateUrl: '/templates/faq.html'
           })
          .when('/login', {
              controller: 'LoginCtrl',
              templateUrl: "/templates/login.html",
              resolve: {
                  confirmUser: ['authService', '$route', function (authService, $route) {
                      var userId = $route.current.params.userId;
                      if (userId) {
                          var verify = {
                              userId: userId,
                              code: $route.current.params.code
                          }
                          return authService.verifyEmail(verify)
                      }
                      else {
                          return false;
                      }

                  }]
              }
          })
              .when("/signup", {
                  controller: "SignupCtrl",
                  templateUrl: "/templates/signup.html"
              })
              .when("/recover", {
                  controller: "RecoverCtrl",
                  templateUrl: "/templates/signup.html"
              })
              .when("/forgotpass", {
                  controller: "ForgotPassCtrl",
                  templateUrl: "/templates/email.html"
              })
              .when("/dashboard", {
                  controller: "DashboardCtrl",
                  templateUrl: "/templates/dashboard.html",
                  resolve: {
                      initialData: ['wishAndGiftService', function (wishAndGiftService) {
                          return wishAndGiftService.getInterestingActivities();
                      }],
                      historyGifts: ['wishAndGiftService', function (wishAndGiftService) {
                          return wishAndGiftService.showGifts({ Length: 5, Offset: 0 });
                      }],
                      historyWishes: ['wishAndGiftService', function (wishAndGiftService) {
                          return wishAndGiftService.showWishes({ Length: 5, Offset: 0 });
                      }]
                  }
              })
              .when("/wishform", {
                  controller: "WishFormCtrl",
                  templateUrl: "/templates/wishform.html",
                  resolve: {
                      initialData: ['wishAndGiftService', function (wishAndGiftService) {
                          return wishAndGiftService.getEmptyWish();
                      }],
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }],
                      startPoint: ['$route', 'wishAndGiftService', function ($route, wishAndGiftService) {
                          return wishAndGiftService.setReturnPoint($route.current.params.itemtype, $route.current.params.itemid);
                      }]
                  }
              })
                  .when("/giftform", {
                      controller: "GiftFormCtrl",
                      templateUrl: "/templates/giftform.html",
                      resolve: {
                          initialData: ['wishAndGiftService', function (wishAndGiftService) {
                              return wishAndGiftService.getEmptyGift();
                          }],
                          countries: ['geoService', function (geoService) {
                              return geoService.getCountry();
                          }],
                          startPoint: ['$route', 'wishAndGiftService', function ($route, wishAndGiftService) {
                              return wishAndGiftService.setReturnPoint($route.current.params.itemtype, $route.current.params.itemid);
                          }]
                      }
                  })
              .when("/profile", {
                  controller: "ProfileCtrl",
                  templateUrl: "/templates/profile.html",
                  resolve: {
                      initialData: ['profileService', function (profileService) {
                          return profileService.getPtofile();
                      }],
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
              .when("/findgift", {
                  controller: "FindGiftCtrl",
                  templateUrl: "/templates/findgift.html",
                  resolve: {
                      /*initialData: ['wishAndGiftService', function ( wishAndGiftService ) {
                          return wishAndGiftService.getGifts( {Offset:0,Length:20});
                      }],*/
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
              .when("/findwish", {
                  controller: "FindWishCtrl",
                  templateUrl: "/templates/findwish.html",
                  resolve: {
                      /*initialData: ['wishAndGiftService', function ( wishAndGiftService ) {
                          return wishAndGiftService.getWishes( { Offset: 0, Length: 20 } );
                      }],*/
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
              .when("/history", {
                  controller: "HistoryCtrl",
                  templateUrl: "/templates/history.html",
                  resolve: {
                      /*giftsData: ['wishAndGiftService', function ( wishAndGiftService ) {
                          return wishAndGiftService.showGifts({});
                      }],
                      wishesData: ['wishAndGiftService', function ( wishAndGiftService ) {
                          return wishAndGiftService.showWishes({});
                      }],*/
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
                .when("/gift/:itemId", {
                      controller: "ItemCardCtrl",
                      templateUrl: "/templates/giftcard.html",
                      resolve: {
                          initialData: ['$route', 'wishAndGiftService', function ($route, wishAndGiftService) {
                              return wishAndGiftService.getGiftById($route.current.params.itemId);
                          }]
                      }
                  })
              .when("/wish/:itemId", {
                  controller: "ItemCardCtrl",
                  templateUrl: "/templates/wishcard.html",
                  resolve: {
                      initialData: ['$route', 'wishAndGiftService', function ($route, wishAndGiftService) {
                          return wishAndGiftService.getWishById($route.current.params.itemId);
                      }]
                  }
              })
              .when("/user/:userId", {
                  controller: "UserCtrl",
                  templateUrl: "/templates/user.html",
                  resolve: {
                      initialData: ['$route', 'profileService', function ($route, profileService) {
                          return profileService.getShortPtofile($route.current.params.userId);
                      }]
                  }
              })
        .otherwise({
            redirectTo: '/landing'
        });

      $httpProvider.interceptors.push('authInterceptorService');
  }]);

app.run(['authService', '$rootScope', '$location', '$anchorScroll', function (authService, $rootScope, $location, $anchorScroll) {

    authService.fillAuthData();

    if (!String.prototype.startsWith) {
        Object.defineProperty(String.prototype, 'startsWith', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (searchString, position) {
                position = position || 0;
                return this.lastIndexOf(searchString, position) === position;
            }
        });
    }
    $(function () {
        $.extend($.inputmask.defaults.definitions, {
            'l': {
                "validator": "[A-z \.\-\]",
                "cardinality": 1,
                'prevalidator': null
            }
        });
    });

    //when the route is changed scroll to the proper element.
    $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
        if ($location.hash()) $anchorScroll();
    });
}]);