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
    .controller('ShelveController', function ($http, $routeParams, $scope) {
        $scope.books = {
            available: [],
            onShelve: []
        };

        $http.get('/api/books').success(function (data) {
            $scope.books.available = data;
        });
        $http.get('/api/shelves/' + $routeParams.userId)
            .success(function (data) {
                $scope.books.onShelve = data;
            });

    });
