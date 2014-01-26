angular.module('mobileClone')
    .directive('mcPage', function factory($pages, $transitions) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                id: '@',
                title: '@'
            },
            template: '<section ng-transclude></section>',
            controller: function ($scope, $element) {
                var buttons = $scope.buttons = [];
                this.addButton = function (button) {
                    buttons.push(button);
                }
            },
            link: function (scope, element, attrs) {
                console.log('rendering page in element:', element, 'with attributes:', attrs);
                element.find('header').append('<h1>' + scope.title + '</h1>');
                $transitions.resize(element.find('h1')[0]);
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
                        $pages.next($scope.changeTo, null);
                    } else {
                        console.log('no action associated with the page');
                    }
                }
            },
            link: function (scope, element, attrs, pageCtrl) {
                console.log('rendering button in element:', element, 'with attributes:', attrs);
                var classes = [scope.position + '-nav' || 'left-nav'];
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
            template: '<div class="scrollWrap"><div class="scroll"><div class="content"><div class="strap" ng-transclude></div></div></div></div>',
            link: function (scope, element, attrs) {
                console.log('rendering content in element:', element, 'with attributes:', attrs);
                var html = '<div class="scrollMask"></div>';
                element.parent().find('header').after(html);
            }
        };
    });
