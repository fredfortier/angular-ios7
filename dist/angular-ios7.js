angular.module('mobileClone', ['ngRoute', 'ngTouch', 'ngAnimate']);;angular.module('mobileClone')
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
                        if ($scope.back) {
                            $pages.back($scope.changeTo, null);
                        } else {
                            $pages.next($scope.changeTo, null);
                        }
                    } else {
                        console.log('no action associated with the page');
                    }
                }
            },
            link: function (scope, element, attrs, pageCtrl) {
                console.log('rendering button in element:', element, 'with attributes:', attrs);
                var classes = [scope.position + '-nav' || 'left-nav'];
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
            template: '<div class="scrollWrap"><div class="scroll"><div class="content"><div class="strap" ng-transclude></div></div></div></div>',
            link: function (scope, element, attrs) {
                console.log('rendering content in element:', element, 'with attributes:', attrs);
                var html = '<div class="scrollMask"></div>';
                element.parent().find('header').after(html);
            }
        };
    });
;angular.module('mobileClone')
    .directive('mcView', function factory($pages, $rootScope, $q, $compile, $templateCache, $location) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '<ng-view id="ng-view" class="slide-animation ' + ((isMobile) ? 'native ios7' : 'ios7') + '"></ng-view>',
            controller: function ($scope, $element) {
                console.log('rendering mobile clone view:', $element, 'with scope:', $scope);
                $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
                    console.log("changed the route from:", prevRoute, "to", currRoute);
                    function getPage(route) {
                        var url = route && route.$$route && route.$$route.originalPath;
                        return (url) ? url.split('/')[1] : null;
                    }

                    $scope.current = getPage(currRoute);
                    if (!$scope.current) {
                        console.log('invalid route, expecting redirection');
                        return;
                    }
                    $scope.previous = getPage(prevRoute);

                    if (currRoute.pathParams) {
                        console.log('adding the route params to scope:', currRoute.pathParams);
                        angular.extend($scope, currRoute.pathParams);
                    }
                    var isBack = null;
                    if (currRoute.params) {
                        console.log('found params in the route', currRoute.params, 'looking for back action...');
                        isBack = currRoute.params.back;
                    }
                    $rootScope.$emit('pageChangeStart', $scope);
                    console.log("found page(s) in route:", {current: $scope.current, previous: $scope.previous});
                    $pages.route($scope.previous, $scope.current, isBack);
                });
            },
            link: function (scope, element, attrs) {
            }
        };
    });
;angular.module('mobileClone')
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
                console.log('transitioning from:', $pages.previous, 'to', $pages.current);
                console.log('is back action:', $pages.isBack);
                var animation = ($pages.isBack) ? 'sr' : 'sl';
                $transitions.slide(animation, $pages.previous, $pages.current)
                    .then(function () {
                        console.log('slide transition complete with animation:', animation);
                        done();
                    });
            },
            leave: function (element, done) {
                console.log('giving one second for the transition animation to complete');
                $timeout(function () {
                    console.log('removing', $pages.previous, 'from ng-view...');
                    done();
                }, 800); //TODO: hack, fix this animation logic
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
;angular.module('mobileClone').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('cordova/platforms/ios/www/demo/partials/view-details.html',
    "<mc-page id=\"view-details\" title=\"Details Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\">Back</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <div class=\"strap\">\n" +
    "            <div class=\"jumbotron\">\n" +
    "\n" +
    "                <div class=\"container\">\n" +
    "                    <h1>{{title}}</h1>\n" +
    "\n" +
    "                    <p>{{description}}</p>\n" +
    "\n" +
    "                    <p><a class=\"btn btn-primary btn-lg\" role=\"button\">Learn more</a></p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-12 col-lg-6\">\n" +
    "                        <div class=\"btn-group btn-group-justified\">\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Left</a>\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Middle</a>\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Right</a>\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <span class=\"input-group-addon\">@</span>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Username\">\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Block level button\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-lg btn-block\">Block level button\n" +
    "                        </button>\n" +
    "                        <br>\n" +
    "                        <ul class=\"list-group\">\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">14</span>\n" +
    "                                Cras justo odio\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">2</span>\n" +
    "                                Dapibus ac facilisis in\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">1</span>\n" +
    "                                Morbi leo risus\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('cordova/platforms/ios/www/demo/partials/view-done.html',
    "<mc-page id=\"view-done\" title=\"Done Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\">Back</mc-nav>\n" +
    "        <mc-nav position=\"right\" change-to=\"view-home\" action=\"true\">Done</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <h1>Done!</h1>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('cordova/platforms/ios/www/demo/partials/view-home.html',
    "<mc-page id=\"view-home\" title=\"Test Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\">Menu</mc-nav>\n" +
    "        <mc-nav position=\"right\" change-to=\"view-done\" action=\"true\">Info</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <mc-list items=\"items\" change-to=\"view-details\" param=\"id\"></mc-list>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('cordova/www/demo/partials/view-details.html',
    "<mc-page id=\"view-details\" title=\"Details Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\">Back</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <div class=\"strap\">\n" +
    "            <div class=\"jumbotron\">\n" +
    "\n" +
    "                <div class=\"container\">\n" +
    "                    <h1>{{title}}</h1>\n" +
    "\n" +
    "                    <p>{{description}}</p>\n" +
    "\n" +
    "                    <p><a class=\"btn btn-primary btn-lg\" role=\"button\">Learn more</a></p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-12 col-lg-6\">\n" +
    "                        <div class=\"btn-group btn-group-justified\">\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Left</a>\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Middle</a>\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Right</a>\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <span class=\"input-group-addon\">@</span>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Username\">\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Block level button\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-lg btn-block\">Block level button\n" +
    "                        </button>\n" +
    "                        <br>\n" +
    "                        <ul class=\"list-group\">\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">14</span>\n" +
    "                                Cras justo odio\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">2</span>\n" +
    "                                Dapibus ac facilisis in\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">1</span>\n" +
    "                                Morbi leo risus\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('cordova/www/demo/partials/view-done.html',
    "<mc-page id=\"view-done\" title=\"Done Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\">Back</mc-nav>\n" +
    "        <mc-nav position=\"right\" change-to=\"view-home\" action=\"true\">Done</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <h1>Done!</h1>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('cordova/www/demo/partials/view-home.html',
    "<mc-page id=\"view-home\" title=\"Test Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\">Menu</mc-nav>\n" +
    "        <mc-nav position=\"right\" change-to=\"view-done\" action=\"true\">Info</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <mc-list items=\"items\" change-to=\"view-details\" param=\"id\"></mc-list>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('demo/partials/view-details.html',
    "<mc-page id=\"view-details\" title=\"Details Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\" change-to=\"view-home\">Back</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <div class=\"strap\">\n" +
    "            <div class=\"jumbotron\">\n" +
    "\n" +
    "                <div class=\"container\">\n" +
    "                    <h1>{{title}}</h1>\n" +
    "\n" +
    "                    <p>{{description}}</p>\n" +
    "\n" +
    "                    <p><a class=\"btn btn-primary btn-lg\" role=\"button\">Learn more</a></p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-12 col-lg-6\">\n" +
    "                        <div class=\"btn-group btn-group-justified\">\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Left</a>\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Middle</a>\n" +
    "                            <a class=\"btn btn-default\" role=\"button\">Right</a>\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <span class=\"input-group-addon\">@</span>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Username\">\n" +
    "                        </div>\n" +
    "                        <br>\n" +
    "                        <button type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Block level button\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-lg btn-block\">Block level button\n" +
    "                        </button>\n" +
    "                        <br>\n" +
    "                        <ul class=\"list-group\">\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">14</span>\n" +
    "                                Cras justo odio\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">2</span>\n" +
    "                                Dapibus ac facilisis in\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item\">\n" +
    "                                <span class=\"badge\">1</span>\n" +
    "                                Morbi leo risus\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('demo/partials/view-done.html',
    "<mc-page id=\"view-done\" title=\"Done Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\" change-to=\"view-home\">Back</mc-nav>\n" +
    "        <mc-nav position=\"right\" change-to=\"view-home\" action=\"true\">Done</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <h1>Done!</h1>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );


  $templateCache.put('demo/partials/view-home.html',
    "<mc-page id=\"view-home\" title=\"Test Page\">\n" +
    "    <header>\n" +
    "        <mc-nav position=\"left\" back=\"true\" change-to=\"view-done\">Menu</mc-nav>\n" +
    "        <mc-nav position=\"right\" change-to=\"view-done\" action=\"true\">Info</mc-nav>\n" +
    "    </header>\n" +
    "    <mc-content>\n" +
    "        <mc-list items=\"items\" change-to=\"view-details\" param=\"id\"></mc-list>\n" +
    "    </mc-content>\n" +
    "</mc-page>\n"
  );

}]);
