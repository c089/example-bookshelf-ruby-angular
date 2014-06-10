/* jshint -W030 */

var expect = chai.expect,
    books = [
        {
            id: '1',
            title: '1984',
            author: 'George Orwell'
        },
        {
            id: '2',
            title: 'Brave New World',
            author: 'Aldous Huxley'
        },
        {
            id: '3',
            title: 'Hitchhikers Guide To The Galaxy',
            author: 'Douglas Adams'
        },
    ];


describe('bookshelf frontend app', function () {

    beforeEach(module('bookshelfApp'));

    it('should initialize', inject(function (version) {
        expect(version).to.be.defined;
    }));
});

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
        $httpBackend.expectPUT('/api/shelves/c089', ['1']).respond(200);
        repo.updateShelf('c089', [books[0]]);
        $httpBackend.flush();
    }));

});
