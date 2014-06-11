angular.module('bookshelfApp.booksRepository', [])
    .factory('BooksRepository', ['$http', function ($http) {
        var shelfPath = function (userId) {
            return '/api/shelves/' + userId;
        }, extractData = function (result) {
            return result.data;
        };

        return {
            retrieveBooks: function () {
                return $http.get('/api/books').then(extractData);
            },
            createBook: function (bookData) {
                return $http.post('/api/books', bookData)
                    .then(extractData);
            },
            deleteBook: function (bookId) {
                return $http.delete('/api/books/' + bookId);
            },
            retrieveShelf: function(userId) {
                return $http.get(shelfPath(userId)).then(extractData);
            },
            updateShelf: function(userId, books) {
                return $http.put(shelfPath(userId), _.pluck(books, 'id'));
            }

        };
    }]);
