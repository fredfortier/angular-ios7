angular.module('mobileClone')
    .directive('page', function factory($history) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '../partials/page.html',
            link: function ($element, $attrs) {
                console.log('rendering page in element:', $element, 'with attributes:', $attrs);
            }
        };
    });
