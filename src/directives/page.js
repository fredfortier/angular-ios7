angular.module('mobileClone')
    .directive('mcPage', function factory($pages) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mcView',
            scope: {
                id: '@',
                title: '@',
                main: '='
            },
            template: '<section ng-transclude></section>',
            controller: function ($scope, $element) {
                var buttons = $scope.buttons = [];
                this.addButton = function (button) {
                    buttons.push(button);
                }
                $pages.add($scope);
            },
            link: function (scope, element, attrs) {
                console.log('rendering page in element:', element, 'with attributes:', attrs);
                element.find('header').append('<h1>' + scope.title + '</h1>');
                var current = (scope.main === true);
                if (!current) {
                    element.addClass('hidden');
                }
            }
        };
    })
    .directive('mcNav', function factory($pages) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mcPage',
            scope: {
                position: '@',
                changeTo: '@',
                back: '=',
                action: '='
            },
            template: '<button ng-click="clicked()"><div class="label" ng-transclude></div></button>',
            controller: function ($scope, $element) {
                $scope.clicked = function () {
                    console.log('clicked:', $scope);
                    if ($scope.changeTo) {
                        $pages.next($scope.changeTo);
                    } else if ($scope.back === true) {
                        $pages.back();
                    } else {
                        console.log('no action associated with the page');
                    }
                }
            },
            link: function (scope, element, attrs, pageCtrl) {
                console.log('rendering button in element:', element, 'with attributes:', attrs);
                var classes = [scope.position || 'left'];
                if (scope.back === true) {
                    classes.push('arrow');
                }
                if (scope.action === true) {
                    classes.push('bold');
                }
                element.addClass(classes.join(' '));
                pageCtrl.addButton(scope);
            }
        };
    })
    .directive('mcContent', function factory() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mcPage',
            scope: {},
            template: '<div class="scrollWrap"><div class="scroll"><div class="content" ng-transclude></div></div></div>',
            link: function (scope, element, attrs) {
                console.log('rendering content in element:', element, 'with attributes:', attrs);
                element.parent().find('header').after('<div class="scrollMask"></div>');
            }
        };
    });
