angular.module('mobileClone')
    .directive('mcPages', function factory($history) {
        return {
            restrict: 'E',
            scope: true,
            controller: function ($scope, $element) {
                console.log('rendering pages element:', $element, 'with scope:', $scope);
                this.addPage = function (page, current) {
                    if (current) {
                        console.log('got current page:', page);
                        $history.current(page);
                    }
                    $history.add(page);
                    this.registerButtons(page);
                }
                this.registerButtons = function (page) {
                    var buttons = page.buttons;
                    angular.forEach(buttons, function (button) {
                        if (button.changeTo || button.back === true) {
                            console.log('registering a tap handle to switch to page:', button.changeTo);
                            var position = button.position || 'left';
                            document.querySelector('#' + page.id + ' button.' + position).addEventListener('click', function () {
                                if (button.changeTo) {
                                    console.log('changing from:', page.id, 'to:', button.changeTo);
                                    $history.change(button.changeTo)
                                        .then(function () {
                                            console.log('paged changed');
                                        })
                                        .catch(function (err) {
                                            console.error(err);
                                        });
                                } else if (button.back === true) {
                                    console.log('going back to previous page...');
                                    $history.back()
                                        .then(function () {
                                            console.log('paged changed');
                                        })
                                        .catch(function (err) {
                                            console.error(err);
                                        });
                                }
                            });
                        }
                    });
                }
            },
            link: function (scope) {
                console.log('rendering pages...');
            }
        };
    });
