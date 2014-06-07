angular
    .module('bookshelfApp', [])
    .value('version', 'dev')
    .controller('ShelveController', function ($http, $scope) {
        $scope.books = {
            available: [],
            onShelve: []
        };

        $http.get('/api/books').success(function (data) {
            $scope.books.available = data;
        });

    });
