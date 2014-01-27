angular.module('mobileClone')
    .factory('$pages', function ($transitions, $q, $location, $window) {
        var $pages = {
            current: null,
            previous: null,
            isBack: null,
            route: function (prevPageId, currentPageId, isBack) {
                this.current = currentPageId;
                this.previous = prevPageId;
                this.isBack=isBack;
            },
            next: function (pageId, param) {
                this.go(pageId, param, false);
            },
            back: function (pageId, param) {
                this.go(pageId, param, true);
            },
            go: function (pageId, param, isBack) {
                $location.path('/' + pageId + ((param) ? '/' + param : '')).search((isBack) ? {back: true} : {});
            }
        };
        return $pages;
    });
