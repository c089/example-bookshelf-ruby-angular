var mod = angular.module(
        'bookshelfApp.admin', ['bookshelfApp.booksRepository']);

mod.controller('AdminController',
    function ($q, $routeParams, $scope, BooksRepository) {
        function updateBookList() {
            BooksRepository.retrieveBooks().then(function (books) {
                $scope.book = {};
                $scope.books = books;
            });
        }

        $scope.addBook = function (book) {
            BooksRepository
                .createBook(book)
                .then(updateBookList);
        };

        $scope.deleteBook = function (book) {
            $scope.books = _($scope.books).without(book);
            BooksRepository.deleteBook(book.id);
        };

        updateBookList();
    });
