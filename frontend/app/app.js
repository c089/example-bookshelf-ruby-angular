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
            $scope.books.available = results[0].data;
            $scope.books.onShelve = results[1].data;
        });

    });
