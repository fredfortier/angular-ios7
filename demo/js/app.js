angular.module('mobileCloneDemo', ['mobileClone'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/view-home", {
                template: "view-home"
            })
            .when("/view-done", {
                template: "view-done"
            })
            .when("/view-details/:itemId", {
                template: "view-details"
            })
            .otherwise({
                redirectTo: "/view-home"
            });
    })
    .run(function () {

    })
    .controller('DemoCtrl', function ($scope) {
        console.log('in the DemoCtrl', $scope);
        var items = $scope.items = [];
        for (var i = 0; i < 20; i++) {
            var item = {id: i, title: 'Item #' + i, desc: 'Item Description #' + i};
            items.push(item);
        }
    })
