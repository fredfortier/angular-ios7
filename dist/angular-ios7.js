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
;angular.module('mobileClone')
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
                $pages.add($scope);
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
                        $pages.next($scope.changeTo);
                    } else if ($scope.back === true) {
                        $pages.back();
                    } else {
                        console.log('no action associated with the page');
                    }
                }
            },
            link: function (scope, element, attrs, pageCtrl) {
                console.log('rendering button in element:', element, 'with attributes:', attrs);
                var classes = [scope.position || 'left'];
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
            scope: {},
            template: '<div class="scrollWrap"><div class="scroll"><div class="content" ng-transclude></div></div></div>',
            link: function (scope, element, attrs) {
                console.log('rendering content in element:', element, 'with attributes:', attrs);
                element.parent().find('header').after('<div class="scrollMask"></div>');
            }
        };
    });
;angular.module('mobileClone')
    .directive('mcView', function factory($pages, $rootScope, $q, $compile, $templateCache, $location) {
        return {
            restrict: 'E',
            scope: true,
            replace:true,
            template: '<ng-view id="ng-view" class="slide-animation"></ng-view>',
            controller: function ($scope, $element) {
                console.log('rendering mobile clone view:', $element, 'with scope:', $scope);
                $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
                    console.log("changed the route from:", prevRoute, "to", currRoute);
                    if (!(currRoute && currRoute.$$route && currRoute.$$route.originalPath)) {
                        console.warn('could not process route because it is invalid: ' + JSON.stringify(currRoute));
                        return false;
                    }
                    function getPage(route) {
                        var url = route && route.$$route && route.$$route.originalPath;
                        return (url) ? url.split('/')[1] : null;
                    }

                    $scope.current = getPage(currRoute);
                    $scope.previous = getPage(prevRoute);

                    if (currRoute.pathParams) {
                        console.log('adding the route params to scope:', currRoute.pathParams);
                        angular.extend($scope, currRoute.pathParams);
                    }
                    $rootScope.$emit('pageChangeStart', $scope);
                    console.log("found page(s) in route:", {current: $scope.current, previous: $scope.previous});
                });
            },
            link: function (scope, element, attrs) {
                scope.$watch('current', function (page, oldPage) {
                    if (page === oldPage) {
                        console.log('the page did not change, ignoring the event...');
                        return;
                    }
                    var back = false;
                    if ($location.search().back) {
                        back = true;
                    }
                    $pages.route(scope.previous, page, back);
                    console.log('updated pages info:', $pages.info());
                });
            }
        };
    });
;angular.module('mobileClone', ['ngRoute', 'ngTouch', 'ngAnimate']);;angular.module('mobileClone')
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
;//My implementation of mobile header, scrolling, swipe events, lists and page transitions if based on this:
//http://c2prods.com/web/2013/cloning-the-ui-of-ios-7-with-html-css-and-javascript/
//It is a very simple and minimalist implementation largely CSS driven
//There is the code below, a CSS and that's it!

//Everything that does not fall into these mobile specific areas should use a UI framework (like Bootstrap)
var $ = function (id) {
    return document.getElementById(id);
};

var slideOpts = {
    sl: ['slin', 'slout' ],
    sr: ['srin', 'srout' ],
    popin: ['popin', 'noanim'],
    popout: ['noanim', 'popout']
};

var clearNode = function (node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

var Slide = function (slideType, vin, vout, callback) {
    var vIn = $(vin),
        vOut = $(vout),
        onAnimationEnd = function () {
            vOut.classList.add('hidden');
            vIn.classList.remove(slideOpts[slideType][0]);
            vOut.classList.remove(slideOpts[slideType][1]);
            vOut.removeEventListener('webkitAnimationEnd', onAnimationEnd, false);
            vOut.removeEventListener('animationend', onAnimationEnd);
        };
    vOut.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
    vOut.addEventListener('animationend', onAnimationEnd);
    if (callback && typeof(callback) === 'function') {
        callback();
    }
    vIn.classList.remove('hidden');
    vIn.classList.add(slideOpts[slideType][0]);
    vOut.classList.add(slideOpts[slideType][1]);
};

var ScrollTop = function () {
    var el = this.parentNode.parentNode.childNodes[5],
        offset = el.scrollTop,
        interval = setInterval(function () {
            el.scrollTop = offset;
            offset -= 24;
            if (offset <= -24) {
                clearInterval(interval);
            }
        }, 8);
};

var TextboxResize = function (el) {
    el.removeEventListener('click', ScrollTop, false);
    el.addEventListener('click', ScrollTop, false);
    var leftbtn = el.parentNode.querySelectorAll('button.left')[0];
    var rightbtn = el.parentNode.querySelectorAll('button.right')[0];
    if (typeof leftbtn === 'undefined') {
        leftbtn = {
            offsetWidth: 0,
            className: ''
        };
    }
    if (typeof rightbtn === 'undefined') {
        rightbtn = {
            offsetWidth: 0,
            className: ''
        };
    }
    var margin = Math.max(leftbtn.offsetWidth, rightbtn.offsetWidth);
    el.style.marginLeft = margin + 'px';
    el.style.marginRight = margin + 'px';
    var tooLong = (el.offsetWidth < el.scrollWidth) ? true : false;
    if (tooLong) {
        if (leftbtn.offsetWidth < rightbtn.offsetWidth) {
            el.style.marginLeft = leftbtn.offsetWidth + 'px';
            el.style.textAlign = 'right';
        } else {
            el.style.marginRight = rightbtn.offsetWidth + 'px';
            el.style.textAlign = 'left';
        }
        tooLong = (el.offsetWidth < el.scrollWidth) ? true : false;
        if (tooLong) {
            if (new RegExp('arrow').test(leftbtn.className)) {
                clearNode(leftbtn.childNodes[1]);
                el.style.marginLeft = '26px';
            }
            if (new RegExp('arrow').test(rightbtn.className)) {
                clearNode(rightbtn.childNodes[1]);
                el.style.marginRight = '26px';
            }
        }
    }
};
angular.module('mobileClone')
    .animation('.slide-animation', function ($pages, $transitions, $timeout) {
        return {
            enter: function (element, done) {
                console.log('animating enter element:', element);
                console.log('transitioning from:', $pages.previous(), 'to', $pages.current());
                console.log('the back page:', $pages._back);
                var animation = ($pages._back) ? 'sr' : 'sl';
                $transitions.slide(animation, $pages.previous().id, $pages.current().id)
                    .then(function () {
                        console.log('slide transition complete with animation:', animation);
                        done();
                    });
            },
            leave: function (element, done) {
                console.log('giving one second for the transition animation to complete');
                $timeout(function () {
                    console.log('removing', $pages.previous(), 'from ng-view...');
                    done();
                }, 1000);
            }
        }
    })
    .factory('$transitions', function ($q) {
        return {
            slide: function (animation, from, to) {
                console.log('sliding:', animation, from, to);
                var deferred = $q.defer();
                try {
                    Slide(animation, to, from, function () {
                        deferred.resolve(true);
                    });
                } catch (err) {
                    deferred.reject(err);
                }
                return deferred.promise;
            },
            resize: function (el) {
                console.log('resizing header:', el);
                TextboxResize(el);
            }
        }
    });