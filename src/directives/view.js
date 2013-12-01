angular.module('mobileClone')
    .directive('mcView', function factory($pages, $rootScope, $q, $compile, $templateCache, $location) {
        return {
            restrict: 'E',
            scope: true,
            replace:true,
            template: '<ng-view id="ng-view" class="slide-animation"></ng-view>',
            controller: function ($scope, $element) {
                console.log('rendering mobile clone view:', $element, 'with scope:', $scope);
                $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
                    console.log("changed the route from:", prevRoute, "to", currRoute);
                    if (!(currRoute && currRoute.$$route && currRoute.$$route.originalPath)) {
                        console.warn('could not process route because it is invalid: ' + JSON.stringify(currRoute));
                        return false;
                    }
                    function getPage(route) {
                        var url = route && route.$$route && route.$$route.originalPath;
                        return (url) ? url.split('/')[1] : null;
                    }

                    $scope.current = getPage(currRoute);
                    $scope.previous = getPage(prevRoute);

                    if (currRoute.pathParams) {
                        console.log('adding the route params to scope:', currRoute.pathParams);
                        angular.extend($scope, currRoute.pathParams);
                    }
                    $rootScope.$emit('pageChangeStart', $scope);
                    console.log("found page(s) in route:", {current: $scope.current, previous: $scope.previous});
                });
            },
            link: function (scope, element, attrs) {
                scope.$watch('current', function (page, oldPage) {
                    if (page === oldPage) {
                        console.log('the page did not change, ignoring the event...');
                        return;
                    }
                    var back = false;
                    if ($location.search().back) {
                        back = true;
                    }
                    $pages.route(scope.previous, page, back);
                    console.log('updated pages info:', $pages.info());
                });
            }
        };
    });
