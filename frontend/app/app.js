var mod = angular.module('bookshelfApp', [
    'ngRoute',
    'bookshelfApp.admin',
    'bookshelfApp.shelf',
    'bookshelfApp.testUtils'
]);

mod.value('version', 'dev');
mod.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/admin', {
            controller: 'AdminController',
            templateUrl: 'admin.html'
        })
        .when('/shelve/:userId', {
            controller: 'ShelfController',
            templateUrl: 'shelve.html'
        })
        .otherwise({
            redirectTo: '/admin'
        });
}]);
