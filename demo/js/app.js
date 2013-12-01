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
            .otherwise({
                redirectTo: "/view-home"
            });
    })
    .run(function () {

    })
    .controller('DemoCtrl', function ($scope) {
        console.log('in the DemoCtrl', $scope);
    })
