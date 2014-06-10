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

mod.factory('BooksRepository', ['$http', function ($http) {
    var shelfPath = function (userId) {
        return '/api/shelves/' + userId;
    };

    return {
        retrieveBooks: function () {
            return $http.get('/api/books').then(function (result) {
                return result.data;
            });
        },
        retrieveShelf: function(userId) {
            return $http.get(shelfPath(userId)).then(function (result) {
                return result.data;
            });
        },
        updateShelf: function(userId, books) {
            return $http.put(shelfPath(userId), _.pluck(books, 'id'));
        }

    };
}]);
