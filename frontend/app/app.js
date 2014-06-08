var mod = angular.module('bookshelfApp', ['ngRoute']);

mod.value('version', 'dev');
mod.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/shelve/:userId', {
            controller: 'ShelveController',
            templateUrl: 'shelve.html'
        })
        .otherwise({
            redirectTo: '/shelve/foo'
        });
}]);

mod.controller('ShelveController', function ($q, $routeParams, $scope, BooksApiService) {
    var shelfPath = function () {
            return '/api/shelves/' + $routeParams.userId;
        },
        sendShelfToServer = function () {
            var booksOnShelf = _.chain($scope.books)
                .where({isOnShelf: true})
                .map(function (x) { return _.omit(x, 'isOnShelf'); })
                .value();
            BooksApiService.updateShelf($routeParams.userId, booksOnShelf);
        };

    $scope.addToShelf = function (book) {
        book.isOnShelf = true;
        sendShelfToServer();
    }

    $scope.removeFromShelf = function (book) {
        book.isOnShelf = false;
        sendShelfToServer();
    }

    $q.all([
        BooksApiService.retrieveBooks(),
        BooksApiService.retrieveShelf($routeParams.userId)
    ]).then(function (results) {
        var allBooks = results[0];
        var booksOnShelve = results[1];

        $scope.books = _.map(allBooks, function (book) {
            var idsOfBooksOnShelve = _.pluck(booksOnShelve, 'id');
            return _.extend({}, book, {
                isOnShelf: _(idsOfBooksOnShelve).contains(book.id)
            });
        });
    });

});

mod.factory('BooksApiService', ['$http', function ($http) {
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
