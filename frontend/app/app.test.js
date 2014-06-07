var expect = chai.expect;

describe('bookshelf frontend app', function () {

    beforeEach(module('bookshelfApp'));

    it('should initialize', inject(function (version) {
        expect(version).to.be.defined;
    }));
});

describe('ShelveController', function () {
    var books = [
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

    beforeEach(module('bookshelfApp'));

    it('should load the list of books and the shelve for the given user',
            inject(function ($httpBackend, $controller) {
            var scope = {},
                username = 'c089';

                $httpBackend.expectGET('/api/books').respond(books);
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

    it('can add a book to the shelf', inject(function($injector) {
        var $controller = $injector.get('$controller'),
            scope = { books: [ { id: 1, isOnShelf: false } ]};

        $controller('ShelveController', { $scope: scope });

        scope.addToShelf(scope.books[0]);

        expect(scope.books[0].isOnShelf).to.be.true;

    }));

    it('can remove a book from the shelf', inject(function($injector) {
        var $controller = $injector.get('$controller'),
            scope = { books: [ { id: 1, isOnShelf: true } ]};

        $controller('ShelveController', { $scope: scope });

        scope.removeFromShelf(scope.books[0]);

        expect(scope.books[0].isOnShelf).to.be.false;

    }));


});
