angular.module('bookshelfApp.testUtils', [])
    .factory('resolveWith', function ($q) {
        return function resolveWith(stub, result) {
            var deferred = $q.defer();
            stub.returns(deferred.promise);
            deferred.resolve(result);
        };
    });

