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

describe('ShelveController', function () {

    beforeEach(function () {
        var serviceStub = {
            retrieveBooks: sinon.stub()
        };

        module('bookshelfApp', function ($provide) {
            $provide.value('BooksApiService', serviceStub)
        });

        inject(function ($q) {
            var deferred = $q.defer();
            serviceStub.retrieveBooks.returns(deferred.promise);
            deferred.resolve({data: books});
        });
    });

    it('should load the list of books and the shelve for the given user',
        inject(function ($httpBackend, $controller, $q, BooksApiService) {
        var scope = {},
            username = 'c089';

            $httpBackend.expectGET('/api/shelves/c089').respond([books[1]]);

            $controller('ShelveController', {
                $scope: scope,
                $routeParams: { userId: username }
            });

            $httpBackend.flush();

            expect(scope.books[0].id).to.equal('1');
            expect(scope.books[0].isOnShelf).to.be.false;
            expect(scope.books[1].id).to.equal('2');
            expect(scope.books[1].isOnShelf).to.be.true;
            expect(scope.books[2].id).to.equal('3');
            expect(scope.books[2].isOnShelf).to.be.false;
        })
    );

    it('can add a book to the shelf', inject(function($injector, $q, BooksApiService) {
        var $httpBackend = $injector.get('$httpBackend'),
            $controller = $injector.get('$controller');
            scope = { };

        $httpBackend.expectGET('/api/shelves/c089').respond([]);
        $controller('ShelveController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $httpBackend.flush();

        $httpBackend.expectPUT('/api/shelves/c089', ['1']).respond(200);
        scope.addToShelf(scope.books[0]);
        $httpBackend.flush();
        expect(scope.books[0].isOnShelf).to.be.true;

    }));

    it('can remove a book from the shelf', inject(function($injector, $q, BooksApiService) {
        var $httpBackend = $injector.get('$httpBackend'),
            $controller = $injector.get('$controller'),
            scope = {};

        $httpBackend.expectGET('/api/shelves/c089').respond([books[0]]);
        $controller('ShelveController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $httpBackend.flush();

        $httpBackend.expectPUT('/api/shelves/c089', []).respond(200);
        scope.removeFromShelf(scope.books[0]);
        $httpBackend.flush();
        expect(scope.books[0].isOnShelf).to.be.false;
    }));

});

describe('BooksApiService', function () {
    var BooksApiService;

    beforeEach(module('bookshelfApp'));

    beforeEach(inject(function (_BooksApiService_) {
        BooksApiService = _BooksApiService_;
    }));

    it('should allow to get all books', inject(function ($httpBackend) {
        $httpBackend.expectGET('/api/books').respond(books);
        BooksApiService.retrieveBooks();
        $httpBackend.flush();
    }));

});
