angular.module('mobileClone')
    .directive('mcList', function factory($pages, $compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '=',
                changeTo: '@',
                param: '@'
            },
            template: '<ul class="arrowed"></ul>',
            controller: function($scope) {
                $scope.clicked = function(param) {
                    console.log('clicked item', param);
                    $pages.next($scope.changeTo, param);
                }
            },
            link: function (scope, element, attrs) {
                console.log('rendering list in element:', element, 'with attributes:', attrs);
                console.log('looping through the list items:', scope.items);
                angular.forEach(scope.items, function(item) {
                    var click = (scope.changeTo) ? ' ng-click="clicked(\''+ (scope.param && item[scope.param]) + '\')"' : '';
                    var li = '<li' + click + '><div class="innerLi">' +
                        '<div class="big">' + item.title + '</div>' +
                        '<div class="light">' + item.desc + '</div>' +
                        '</div></li>';
                    element.append(li);
                });
                $compile(element)(scope);
            }
        };
    });
