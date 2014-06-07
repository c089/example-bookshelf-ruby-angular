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
});
