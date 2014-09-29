var project = angular.module('giftKnacksProject', ['ngRoute']);
project.controller(
'AppCtrl',
[
'$scope',
'$log',
function ($scope, $log) {
  $scope.handleMyButton = function () {
    $log.log('Angular Button clicked');
  }
}
]
);
project.config(specifyRoutes);
function specifyRoutes($routeProvider) {
  $routeProvider
  .when('/', { templateUrl: 'partials/home.html' })
  .when('/pagea', { templateUrl: 'partials/pagea.html' });
}
