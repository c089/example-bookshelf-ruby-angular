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
    .controller('ShelveController', function ($http, $scope) {
        $scope.books = {
            available: [],
            onShelve: []
        };

        $http.get('/api/books').success(function (data) {
            $scope.books.available = data;
        });

    });
