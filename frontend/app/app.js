angular
    .module('bookshelfApp', [])
    .value('version', 'dev')
    .controller('ShelveController', function ($scope) {
        $scope.books = {
            available: [],
            onShelve: []
        };
    });
