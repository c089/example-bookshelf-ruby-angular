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
            retrieveBooks: sinon.stub(),
            retrieveShelf: sinon.stub()
        };

        module('bookshelfApp', function ($provide) {
            $provide.value('BooksApiService', serviceStub)
        });

        inject(function ($q) {
            var deferred = $q.defer();
            serviceStub.retrieveBooks.returns(deferred.promise);
            deferred.resolve(books);

            var deferred2 = $q.defer();
            serviceStub.retrieveShelf.returns(deferred2.promise);
            deferred2.resolve([books[1]]);
        });
    });

    it('should load the list of books and the shelve for the given user',
        inject(function ($rootScope, $controller, $q, BooksApiService) {
        var scope = {},
            username = 'c089';

            $controller('ShelveController', {
                $scope: scope,
                $routeParams: { userId: username }
            });
            $rootScope.$apply();

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
            $rootScope = $injector.get('$rootScope'),
            shelfDeferred = $q.defer(),
            scope = { };

        BooksApiService.retrieveShelf.returns(shelfDeferred.promise);
        shelfDeferred.resolve([]);
        $controller('ShelveController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $rootScope.$apply();

        $httpBackend.expectPUT('/api/shelves/c089', ['1']).respond(200);
        scope.addToShelf(scope.books[0]);
        $httpBackend.flush();
        expect(scope.books[0].isOnShelf).to.be.true;

    }));

    it('can remove a book from the shelf', inject(function($injector) {
        var $httpBackend = $injector.get('$httpBackend'),
            $controller = $injector.get('$controller'),
            $rootScope = $injector.get('$rootScope'),
            $q = $injector.get('$q'),
            BooksApiService = $injector.get('BooksApiService'),
            shelfDeferred = $q.defer(),
            scope = {};

        BooksApiService.retrieveShelf.returns(shelfDeferred.promise);
        shelfDeferred.resolve([books[0]]);
        $controller('ShelveController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $rootScope.$apply();

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

    it('should allow to get all books', function(done) {
        inject(function ($httpBackend) {
            $httpBackend.expectGET('/api/books').respond(books);
            BooksApiService.retrieveBooks().then(function (result) {
                expect(result).to.deep.equal(books);
                done();
            });
            $httpBackend.flush();
        })
    });

    it('should allow to get a users shelf', function(done) {
        inject(function ($httpBackend) {
            $httpBackend.expectGET('/api/shelves/c089').respond(books);
            BooksApiService.retrieveShelf('c089').then(function (result) {
                expect(result).to.deep.equal(books);
                done();
            });
            $httpBackend.flush();
        });
    });

});
