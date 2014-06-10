describe('AdminController', function () {
    var $controller,
        $rootScope,
        repository,
        resolveWith;

    beforeEach(function () {
        module('bookshelfApp', function ($provide) {
            repo = {
                createBook: sinon.stub(),
                retrieveBooks: sinon.stub()
            }
            $provide.value('BooksRepository', repo);
        });

        inject(function ($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            repository = $injector.get('BooksRepository');
            resolveWith = $injector.get('resolveWith');

            resolveWith(repo.retrieveBooks, books);
        });

    });

    it('loads the list of existing books', function () {
        var scope = {};

        $controller('AdminController', { $scope: scope, });

        $rootScope.$apply();
        expect(scope.books).to.deep.eq(books);
    })

    it('can add a book', function () {
        var book = {
                title: 't',
                author: 'a',
                image: 'i.jpg'
            },
            scope = {};

        $controller('AdminController', { $scope: scope, });

        resolveWith(repo.createBook, {});
        resolveWith(repo.retrieveBooks, [book]);

        // when I add a boook
        scope.addBook(book);

        // it will be created
        expect(repo.createBook).to.have.been.calledOnce;
        expect(repo.createBook).to.have.been.calledWith(book);

        // and the list of books is updated
        $rootScope.$apply();
        expect(scope.books).to.deep.eq([book]);
    });
});
