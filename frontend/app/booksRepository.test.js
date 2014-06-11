describe('BooksRepository', function () {
    var repo;

    beforeEach(module('bookshelfApp'));

    beforeEach(inject(function (BooksRepository) {
        repo = BooksRepository;
    }));

    it('should allow to get all books', inject(function ($httpBackend) {
        var promise;
        $httpBackend.expectGET('/api/books').respond(books);
        promise = repo.retrieveBooks().then(function (result) {
            expect(result).to.deep.equal(books);
        });
        $httpBackend.flush();
        return promise;
    }));

    it('can create a new books', inject(function ($httpBackend) {
        var promise,
            bookData = { author: 'a', title: 't' },
            response = { data: _.extend({}, bookData, {id: 'generate'}) };

        $httpBackend.expectPOST('/api/books', bookData).respond(response);

        promise = repo.createBook(bookData).then(function (result) {
            expect(result).to.deep.equal(response);
        });

        $httpBackend.flush();
        return promise;
    }));

    it('can delete a book', inject(function ($httpBackend) {
        var promise,
            id = 'foo',
            bookData = { id: id, author: 'a', title: 't' };
        $httpBackend.expectDELETE('/api/books/foo').respond(204, '');

        promise = repo.deleteBook(id);

        $httpBackend.flush();
        return promise;
    }));

    it('should allow to get a users shelf', inject(function ($httpBackend) {
        var promise;
        $httpBackend.expectGET('/api/shelves/c089').respond(books);
        promise = repo.retrieveShelf('c089').then(function (result) {
            expect(result).to.deep.equal(books);
        });
        $httpBackend.flush();
        return promise;
    }));

    it('can update a users shelf', inject(function ($httpBackend) {
        $httpBackend.expectPUT('/api/shelves/c089', ['1']).respond(200, '');
        repo.updateShelf('c089', [books[0]]);
        $httpBackend.flush();
    }));

});
