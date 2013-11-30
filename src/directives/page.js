angular.module('mobileClone')
    .directive('mcPage', function factory($history, $compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                title: '@'
            },
            template: '<section ng-transclude></section>',
            controller: function ($scope, $element) {
                console.log('rendering page children in element:', $element, 'with scope:', $scope);
                var buttons = $scope.buttons = [];
                this.addButton = function (label, position, back, action) {
                }
            },
            link: function (scope, element, attrs) {
                console.log('rendering page in element:', element, 'with attributes:', attrs);
                console.log('the directive scope:', scope);
                element.find('header').append('<h1>' + scope.title + '</h1>');
            }
        };
    })
    .directive('mcNav', function factory($history) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: '^mcPage',
            scope: {
                position: '@',
                changeTo: '@',
                back: '@',
                action: '@'
            },
            template: '<button><div class="label" ng-transclude></div></button>',
            link: function (scope, element, attrs) {
                console.log('rendering button in element:', element, 'with attributes:', attrs);
                var classes = [scope.position || 'left'];
                if (scope.back === true) {
                    classes.push('arrow');
                }
                if (scope.action === true) {
                    classes.push('bold');
                }
                element.addClass(classes.join(' '));
            }
        };
    })
    .directive('mcContent', function factory($history) {
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
