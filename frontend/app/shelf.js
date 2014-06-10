angular.module('bookshelfApp.shelf', []).controller(
        'ShelfController', 
        function ($q, $routeParams, $scope, BooksApiService) {
    var sendShelfToServer = function () {
        var booksOnShelf = _.chain($scope.books)
            .where({isOnShelf: true})
            .map(function (x) { return _.omit(x, 'isOnShelf'); })
            .value();
        BooksApiService.updateShelf($routeParams.userId, booksOnShelf);
    };

    $scope.addToShelf = function (book) {
        book.isOnShelf = true;
        sendShelfToServer();
    };

    $scope.removeFromShelf = function (book) {
        book.isOnShelf = false;
        sendShelfToServer();
    };

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
