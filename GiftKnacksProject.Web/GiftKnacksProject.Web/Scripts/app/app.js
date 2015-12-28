'use strict';

/**
 * @ngdoc overview
 * @name giftknacksApp
 * @description
 * # giftknacksApp
 *
 * Main module of the application.
 */
var app = angular.module('giftknacksApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'angular-loading-bar', 'infinite-scroll', 'ngImgCrop'])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/', {
            title: 'KnacksGifter | Home',
            metaDescription: 'KnacksGifter Home',
            metaKeywords: 'KnacksGifter Landing Page',
            templateUrl: '/templates/landing.html',
            controller: 'MainCtrl'
        })
          .when('/blog', {
              title: 'KnacksGifter | Blog',
              metaDescription: 'KnacksGifter Blog',
              metaKeywords: 'KnacksGifter Blog Page',
              templateUrl: '/templates/blog.html',
              controller: 'BlogCtrl'
          })
          .when('/about', {
              title: 'KnacksGifter | About',
              metaDescription: 'KnacksGifter Info',
              metaKeywords: 'KnacksGifter About Page',
              templateUrl: '/templates/about.html',
              controller: 'AboutCtrl'
          })
           .when('/helpus', {
               title: 'KnacksGifter | FAQ',
               metaDescription: 'KnacksGifter Help Us',
               metaKeywords: 'KnacksGifter Help Us Page',
               templateUrl: '/templates/helpus.html',
               controller: 'HelpUsCtrl'
           })
          .when('/login', {
              title: 'KnacksGifter | Login',
              metaDescription: 'KnacksGifter Login',
              metaKeywords: 'KnacksGifter Login Page',
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
                  title: 'KnacksGifter | Signup',
                  metaDescription: 'KnacksGifter Signup',
                  metaKeywords: 'KnacksGifter Signup Page',
                  controller: "SignupCtrl",
                  templateUrl: "/templates/signup.html"
              })
              .when("/recover", {
                  title: 'KnacksGifter | Recover',
                  metaDescription: 'KnacksGifter Recover',
                  metaKeywords: 'KnacksGifter Recover Page',
                  controller: "RecoverCtrl",
                  templateUrl: "/templates/signup.html"
              })
              .when("/forgotpass", {
                  title: 'KnacksGifter | ForgotPass',
                  metaDescription: 'KnacksGifter ForgotPass',
                  metaKeywords: 'KnacksGifter ForgotPass Page',
                  controller: "ForgotPassCtrl",
                  templateUrl: "/templates/email.html"
              })
              .when("/dashboard", {
                  title: 'KnacksGifter | Dashboard',
                  metaDescription: 'KnacksGifter Dashboard',
                  metaKeywords: 'KnacksGifter Dashboard Page',
                  controller: "DashboardCtrl",
                  templateUrl: "/templates/dashboard.html",
                  resolve: {
                      initialData: ['wishAndGiftService', function (wishAndGiftService) {
                          return wishAndGiftService.getInterestingActivities();
                      }],
                      activity: ['authService', function (authService) {
                          return authService.checkActivity();
                      }],
                      feed: ['feedService', function (feedService) {
                          return feedService.getFeed({ });
                      }]
                  }
              })
              .when("/wishform", {
                  title: 'KnacksGifter | WishForm',
                  metaDescription: 'KnacksGifter WishForm',
                  metaKeywords: 'KnacksGifter WishForm Page',
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
                      title: 'KnacksGifter | GiftForm',
                      metaDescription: 'KnacksGifter GiftForm',
                      metaKeywords: 'KnacksGifter GiftForm Page',
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
                  title: 'KnacksGifter | Profile',
                  metaDescription: 'KnacksGifter Profile',
                  metaKeywords: 'KnacksGifter Profile Page',
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
                  title: 'KnacksGifter | FindGift',
                  metaDescription: 'KnacksGifter FindGift',
                  metaKeywords: 'KnacksGifter FindGift Page',
                  controller: "FindGiftCtrl",
                  templateUrl: "/templates/findgift.html",
                  resolve: {
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
              .when("/findwish", {
                  title: 'KnacksGifter | FindWish',
                  metaDescription: 'KnacksGifter FindWish',
                  metaKeywords: 'KnacksGifter FindWish Page',
                  controller: "FindWishCtrl",
                  templateUrl: "/templates/findwish.html",
                  resolve: {
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
              .when("/history", {
                  title: 'KnacksGifter | History',
                  metaDescription: 'KnacksGifter History',
                  metaKeywords: 'KnacksGifter History Page',
                  controller: "HistoryCtrl",
                  templateUrl: "/templates/history.html",
                  resolve: {
                      countries: ['geoService', function (geoService) {
                          return geoService.getCountry();
                      }]
                  }
              })
                .when("/gift/:itemId", {
                    title: 'KnacksGifter | GiftCard',
                    metaDescription: 'KnacksGifter GiftCard',
                    metaKeywords: 'KnacksGifter GiftCard Page',
                    controller: "ItemCardCtrl",
                    templateUrl: "/templates/giftcard.html",
                    resolve: {
                        initialData: ['$route', 'wishAndGiftService', function ($route, wishAndGiftService) {
                            return wishAndGiftService.getGiftById($route.current.params.itemId);
                        }]
                    }
                })
              .when("/wish/:itemId", {
                  title: 'KnacksGifter | WishCard',
                  metaDescription: 'KnacksGifter WishCard',
                  metaKeywords: 'KnacksGifter WishCard Page',
                  controller: "ItemCardCtrl",
                  templateUrl: "/templates/wishcard.html",
                  resolve: {
                      initialData: ['$route', 'wishAndGiftService', function ($route, wishAndGiftService) {
                          return wishAndGiftService.getWishById($route.current.params.itemId);
                      }]
                  }
              })
              .when("/user/:userId", {
                  title: 'KnacksGifter | User',
                  metaDescription: 'KnacksGifter User',
                  metaKeywords: 'KnacksGifter User Page',
                  controller: "UserCtrl",
                  templateUrl: "/templates/user.html",
                  resolve: {
                      initialData: ['$route', 'profileService', function ($route, profileService) {
                          return profileService.getShortPtofile($route.current.params.userId);
                      }]
                  }
              })
        .otherwise({
            redirectTo: '/'
        });

      $httpProvider.interceptors.push('authInterceptorService');
      $locationProvider.html5Mode(true);
      //$locationProvider.hashPrefix('!');
  }]);

app.value('serviceBase', 'http://giftknackapi.azurewebsites.net/');
app.constant("cacheVersion", '1');

app.run(['authService', '$rootScope', '$location', '$anchorScroll', '$window', function (authService, $rootScope, $location, $anchorScroll, $window) {
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
    $rootScope.$on('$routeChangeSuccess', function (event, newRoute, oldRoute) {
        if ($rootScope && newRoute && newRoute.$$route) {
            var route=newRoute.$$route;
            $rootScope.title = route.title || 'KnacksGifter';
            $rootScope.metaDescription = route.metaDescription || 'KnacksGifter description';
            $rootScope.metaKeywords = route.metaKeywords || 'KnacksGifter keywords';
    }
        if ($location.hash()) $anchorScroll();

        //ga

        //var output = $location.path() + "?";
        //angular.forEach($routeParams, function (value, key) {
        //    output += key + "=" + value + "&";
        //})
        //output = output.substr(0, output.length - 1);

        //$window.ga('set', 'page', $location.path());
        $window.ga('send', 'pageview', $location.path());
    });
}]);