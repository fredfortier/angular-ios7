angular.module('mobileClone')
    .directive('pages', function factory($rootScope, $templateCache, $compile, $history) {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope) {
                console.log('rendering pages...');
            }
        };
    });
