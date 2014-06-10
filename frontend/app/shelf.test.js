describe('ShelfController', function () {
    var $controller,
        $rootScope,
        api,
        resolveWith;

    beforeEach(function () {
        var serviceStub = {
            retrieveBooks: sinon.stub(),
            retrieveShelf: sinon.stub(),
            updateShelf: sinon.stub()
        };

        module('bookshelfApp', function ($provide) {
            $provide.value('BooksRepository', serviceStub);
        });

        inject(function ($injector) {
            var $q = $injector.get('$q');
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            api = $injector.get('BooksRepository');

            resolveWith = function resolveWith(stub, result) {
                var deferred = $q.defer();
                stub.returns(deferred.promise);
                deferred.resolve(result);
            };

            resolveWith(serviceStub.retrieveBooks, books);
            resolveWith(serviceStub.retrieveShelf, []);
        });
    });

    it('should add the isOnShelf property to the list of books', function () {
        var scope = {};

            resolveWith(api.retrieveBooks, books);
            resolveWith(api.retrieveShelf, [books[1]]);

            $controller('ShelfController', { $scope: scope, });
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

        resolveWith(api.retrieveShelf, []);
        $controller('ShelfController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $rootScope.$apply();

        scope.addToShelf(scope.books[0]);

        expect(api.updateShelf).to.have.been.calledOnce;
        expect(api.updateShelf).to.have.been.calledWith('c089', [books[0]]);
        expect(scope.books[0].isOnShelf).to.be.true;

    });

    it('can remove a book from the shelf', function () {
        var scope = {};

        resolveWith(api.retrieveShelf, [books[0]]);
        $controller('ShelfController', {
            $scope: scope,
            $routeParams: { userId: 'c089' }
        });
        $rootScope.$apply();

        scope.removeFromShelf(scope.books[0]);

        expect(api.updateShelf).to.have.been.calledOnce;
        expect(api.updateShelf).to.have.been.calledWith('c089', []);
        expect(scope.books[0].isOnShelf).to.be.false;
    });

});
