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
        $scope.books = {
            available: [],
            onShelve: []
        };

        $q.all([
            $http.get('/api/books'),
            $http.get('/api/shelves/' + $routeParams.userId)
        ]).then(function (results) {
            var allBooks = results[0].data,
                booksOnShelve = results[1].data;

            $scope.books = _.groupBy(allBooks, function (book) {
                var idsOfBooksOnShelve = _.pluck(booksOnShelve, 'id'),
                    bookIsOnShelve = _(idsOfBooksOnShelve).contains(book.id);
                return bookIsOnShelve ? 'onShelve' : 'available';
            });
        });

    });
