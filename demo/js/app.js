angular.module('mobileCloneDemo', ['mobileClone'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/view-home", {
                templateUrl: "view-home.html"
            })
            .when("/view-done", {
                templateUrl: "view-done.html"
            })
            .when("/view-details/:itemId", {
                templateUrl: "view-details.html"
            })
            .otherwise({
                redirectTo: "/view-home"
            });
    })
    .run(function () {

    })
    .controller('DemoCtrl', function ($scope, $pages, $rootScope) {
        console.log('in the DemoCtrl', $scope, $pages.current());
        var items = $scope.items = [];
        for (var i = 0; i < 20; i++) {
            var item = {id: i, title: 'Item #' + i, desc: 'Item Description #' + i};
            items.push(item);
        }
        $rootScope.$on('pageChangeStart', function (event, scope) {
            console.log('page changed with scope:', scope);
            function findItem(itemId) {
                var currentItem = null;
                angular.forEach(items, function (item) {
                    if (item.id == itemId) {
                        currentItem = item;
                        return;
                    }
                });
                return currentItem;
            }

            if (scope.current === 'view-details') {
                var item = findItem(scope.itemId);
                console.log('showing item:', item);
                var title = $scope.title = item.title;
                var description = $scope.description = item.desc;
            }
        });
    })
