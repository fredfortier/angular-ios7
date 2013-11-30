angular.module('mobileClone')
    .factory('$history', function ($transitions, $q) {
        var $history = {
            _current: null,
            _history: [],
            _pages: [],
            add: function (page) {
                $history._pages.push(page);
            },
            current: function (page) {
                if (page) {
                    $history._current = page;
                    $history._history.push(page);
                } else {
                    return $history._current;
                }
            },
            previous: function () {
                return ($history._history.length > 1) && $history._history[($history._history.length - 2)];
            },
            change: function (pageId) {
                var next = null;
                var deferred = $q.defer();
                console.log('looking for page', pageId, 'in pages:', $history._pages);
                angular.forEach($history._pages, function (page) {
                    if (pageId === page.id) {
                        next = page;
                    }
                });
                if (next) {
                    console.log('found page:', next);
                    $transitions.slide('sl', pageId, $history._current.id)
                        .then(function () {
                            console.log('slide transition complete, setting the current page...');
                            $history.current(next);
                            deferred.resolve(true);
                        })
                        .catch(function (err) {
                            deferred.reject(err);
                        });
                } else {
                    deferred.reject('page: ' + pageId + ' not found');
                }
                return deferred.promise;
            },
            back: function () {
                var previous = $history.previous();
                var deferred = $q.defer();
                if (previous) {
                    $transitions.slide('sr', previous.id, $history._current.id).then(function () {
                        console.log('slide transition complete, setting the current page...');
                        $history.current(previous);
                        deferred.resolve(true);
                    })
                        .catch(function (err) {
                            deferred.reject(err);
                        });
                } else {
                    deferred.reject('no previous page to return to');
                }
                return deferred.promise;
            }
        };
        return $history;
    });
