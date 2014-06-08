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
    var $controller,
        $rootScope,
        BooksApiService,
        resolveWith;

    beforeEach(function () {
        var serviceStub = {
            retrieveBooks: sinon.stub(),
            retrieveShelf: sinon.stub(),
            updateShelf: sinon.stub()
        };

        module('bookshelfApp', function ($provide) {
            $provide.value('BooksApiService', serviceStub)
        });

        inject(function ($injector) {
            var $q = $injector.get('$q');
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            BooksApiService = $injector.get('BooksApiService');

            resolveWith = function resolveWith(stub, result) {
                var deferred = $q.defer();
                stub.returns(deferred.promise);
                deferred.resolve(result);
            }

            resolveWith(serviceStub.retrieveBooks, books);
            resolveWith(serviceStub.retrieveShelf, [books[1]]);
        });
    });

    it('should load the list of books and the shelve for the given user', function () {
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
        }
    );

    it('can add a book to the shelf', function() {
        var scope = { };

        resolveWith(BooksApiService.retrieveShelf, []);
        $controller('ShelveController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $rootScope.$apply();

        scope.addToShelf(scope.books[0]);

        expect(BooksApiService.updateShelf).to.have.been.calledOnce;
        expect(BooksApiService.updateShelf).to.have.been.calledWith('c089', [books[0]]);
        expect(scope.books[0].isOnShelf).to.be.true;

    });

    it('can remove a book from the shelf', function () {
        var scope = {};

        resolveWith(BooksApiService.retrieveShelf, [books[0]]);
        $controller('ShelveController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $rootScope.$apply();

        scope.removeFromShelf(scope.books[0]);

        expect(BooksApiService.updateShelf).to.have.been.calledOnce;
        expect(BooksApiService.updateShelf).to.have.been.calledWith('c089', []);
        expect(scope.books[0].isOnShelf).to.be.false;
    });

});

describe('BooksApiService', function () {
    var BooksApiService;

    beforeEach(module('bookshelfApp'));

    beforeEach(inject(function (_BooksApiService_) {
        BooksApiService = _BooksApiService_;
    }));

    it('should allow to get all books', inject(function ($httpBackend) {
        var promise;
        $httpBackend.expectGET('/api/books').respond(books);
        promise = BooksApiService.retrieveBooks().then(function (result) {
            expect(result).to.deep.equal(books);
        });
        $httpBackend.flush();
        return promise;
    }));

    it('should allow to get a users shelf', inject(function ($httpBackend) {
        var promise;
        $httpBackend.expectGET('/api/shelves/c089').respond(books);
        promise = BooksApiService.retrieveShelf('c089').then(function (result) {
            expect(result).to.deep.equal(books);
        });
        $httpBackend.flush();
        return promise;
    }));

    it('can update a users shelf', inject(function ($httpBackend) {
        $httpBackend.expectPUT('/api/shelves/c089', ['1']).respond(200);
        BooksApiService.updateShelf('c089', [books[0]]);
        $httpBackend.flush();
    }));

});
