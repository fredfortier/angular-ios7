angular.module('mobileClone')
    .directive('listview', function factory($history) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '../partials/list.html',
            link: function ($element, $attrs) {
                console.log('rendering list in element:', $element, 'with attributes:', $attrs);
            }
        };
    });
