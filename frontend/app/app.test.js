var expect = chai.expect;

describe('bookshelf frontend app', function () {

    beforeEach(module('bookshelfApp'));

    it('should initialize', inject(function (version) {
        expect(version).to.be.defined;
    }));
});

describe('ShelveController', function () {

    beforeEach(module('bookshelfApp'));

    it('should initialize with empty book lists', inject(function ($controller) {
        var scope = {},
            controller = $controller('ShelveController', { $scope: scope});

        expect(scope.books).to.deep.equal({
            available: [],
            onShelve: []
        });
    }));


    it('should load the list of books and the shelve for the given user',
            inject(function ($httpBackend, $controller) {
            var scope = {},
                controller,
                username = 'c089',
                books = [{ id: '1', title: '1984', author: 'George Orwell'}];

                $httpBackend.expectGET('/api/books').respond(books);
                $httpBackend.expectGET('/api/shelves/c089').respond(books);

                $controller('ShelveController', {
                    $scope: scope,
                    $routeParams: { userId: username }
                });

                $httpBackend.flush();

                expect(scope.books.available).to.deep.equal(books);
                expect(scope.books.onShelve).to.deep.equal(books);

            })
    );

});
