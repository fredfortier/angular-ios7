angular.module('mobileClone')
    .factory('$pages', function ($transitions, $q, $location, $window) {
        var $pages = {
            current: null,
            previous: null,
            back: false,
            route: function (prevPageId, currentPageId, back) {
                this.current = currentPageId;
                this.previous = prevPageId;
                this.back = back;
            },
            next:function(pageId,param) {
                $location.path('/' + pageId + ((param) ? '/' + param : ''));
            }
        };
        return $pages;
    });
