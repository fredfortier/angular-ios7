angular.module('mobileClone')
    .factory('$pages', function ($transitions, $q, $location) {
        var $pages = {
            _current: null,
            _previous: null,
            _history: [],
            _pages: [],
            _back: null,
            _params:null,
            add: function (page) {
                console.log('adding page to collection:', page);
                $pages._pages.push(page);
            },
            route: function (prevPageId, currentPageId, back) {
                if (prevPageId) {
                    console.log('setting previous page from id:', prevPageId);
                    $pages._previous = $pages.find(prevPageId);
                } else {
                    console.log('no previous route, this is the landing page');
                }
                if (currentPageId) {
                    console.log('setting current page from id:', currentPageId);
                    $pages._current = $pages.find(currentPageId);
                }
                if (currentPageId && $pages._current) {
                    console.log('adding current page to history...');
                    $pages._history.push($pages._current);
                    if ($pages.previous() && ($pages.current() != $pages.previous())) {
                        console.log('the route points to a different page, transitioning...');
                        $pages._back = (back);
//                        $pages.transition();
                    }
                } else {
                    throw new Error('could not set the current page, the route is invalid');
                }
            },
            find: function (pageId) {
                console.log('looking for page', pageId, 'in pages:', $pages._pages);
                var result = null;
                angular.forEach($pages._pages, function (page) {
                    if (pageId === page.id) {
                        result = page;
                    }
                });
                return result;
            },
            current: function () {
                return $pages._current;
            },
            previous: function () {
                return $pages._previous;
            },
            info: function () {
                return {current: $pages.current(), previous: $pages.previous(), historySize: $pages._history.length};
            },
            next: function (pageId, param) {
                console.log('going to page:', pageId);
                $location.search({});
                $location.path('/' + pageId + ((param) ? '/' + param : ''));
            },
            back: function () {
                console.log('going back to previous page:', $pages.previous());
                if (!$pages.previous()) {
                    throw new Error('there is no previous page to go back to');
                }
                $location.search({back: true});
                $location.path('/' + $pages.previous().id);
            }
        };
        return $pages;
    });
