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

    it('should load the book lists via API',
        inject(function($httpBackend, $controller) {
            var scope = {},
                controller,
                books = [{ id: '1', title: '1984', author: 'George Orwell'}];

                $httpBackend.expectGET('/api/books').respond(books);

                $controller('ShelveController', { $scope: scope}),

                $httpBackend.flush();

                expect(scope.books.available).to.deep.equal(books);
        }

    ));

});
