angular
    .module('bookshelfApp', ['ngRoute'])
    .value('version', 'dev')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/shelve/:userId', {
                controller: 'ShelveController',
                templateUrl: 'shelve.html'
            })
            .otherwise({
                redirectTo: '/shelve/foo'
            });
    }])
    .controller('ShelveController', function ($http, $q, $routeParams, $scope) {
        $scope.addToShelf = function (book) {
            book.isOnShelf = true;
        }

        $scope.removeFromShelf = function (book) {
            book.isOnShelf = false;
        }

        $q.all([
            $http.get('/api/books'),
            $http.get('/api/shelves/' + $routeParams.userId)
        ]).then(function (results) {
            var allBooks = results[0].data;
            var booksOnShelve = results[1].data;

            $scope.books = _.map(allBooks, function (book) {
                var idsOfBooksOnShelve = _.pluck(booksOnShelve, 'id');
                return _.extend({}, book, {
                    isOnShelf: _(idsOfBooksOnShelve).contains(book.id)
                });
            });
        });

    });
