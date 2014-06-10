var mod = angular.module('bookshelfApp', [
    'ngRoute',
    'bookshelfApp.shelf'
]);

mod.value('version', 'dev');
mod.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/shelve/:userId', {
            controller: 'ShelfController',
            templateUrl: 'shelve.html'
        })
        .otherwise({
            redirectTo: '/shelve/foo'
        });
}]);

