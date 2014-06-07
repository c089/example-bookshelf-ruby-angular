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
        var shelfPath = function () {
                return '/api/shelves/' + $routeParams.userId;
            },
            sendShelfToServer = function () {
                var booksOnShelf = _($scope.books).where({isOnShelf: true});
                $http.put(shelfPath(), _.pluck(booksOnShelf, 'id'));
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
            $http.get('/api/books'),
            $http.get(shelfPath())
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
