//My implementation of mobile header, scrolling, swipe events, lists and page transitions if based on this:
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
    .animation('.slide-animation', function ($pages, $transitions, $q) {
        return {
            enter: function (element, done) {
                //run the animation here and call done when the animation is complete
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
                //run the animation here and call done when the animation is complete
                console.log('animating leave element:', element);
                setTimeout(function () {
                    console.log('leave animation complete');
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
