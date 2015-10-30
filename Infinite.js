(function ($) {
    $.fn.Infinite = function (args) {
        var counter = 0;
        var selectorHeight = {
            top: 0,
            bottom: 0
        };
        var options = $.extend({
            debug: false,
            limit: {
                start: 0,
                total: 10
            },
            repeat: {
                finish: 10,
                loadMore: 5,
                showLoadMore: true
            },
            navSelector: null,
            nextSelector: null,
            loadSelector: null
        }, args);
        var objects = {
            loadSelector: null
        };
        var isLoading = false;
        var isLoadedMoreButton = false;

        this.init(function () {
            _hideLoadMoreButton();
            if (options.limit.items < options.limit.total) {
                _log.warn("Infinite.js doesn't init!");
                _log.error('REASON: The number of items is not enough.');
                return;
            }
            _initScroll();
        });

        _getSelector = function () {
            return $(options.navSelector);
        };

        _getSelectorButton = function () {
            return _getSelector().find('a');
        };

        _getLoadSelector = function () {
            if (objects.loadSelector === null) {
                objects.loadSelector = $(options.loadSelector);
            }
            return objects.loadSelector;
        };

        _initScroll = function () {
            _calculateSelector();
            $(window).scroll(function () {
                if (counter === options.repeat.finish) {
                    _log.warn('Number of repetitions maximum.');
                    return;
                }
                var windowScroll = $(window).scrollTop();
                var windowHeight = $(window).height();
                var targetHeight = (_getSelector().offset().top - windowHeight) - 100;

                if (! isLoadedMoreButton && windowScroll >= targetHeight && isLoading === false) {
                    isLoading = true;

                    if (options.repeat.showLoadMore && counter === options.repeat.loadMore) {
                        _log.log('Display block load more button');
                        _showLoadMoreButton();
                    } else {
                        _doRequest(null, '_appendTarget');
                    }
                }
            });
        };

        _doRequest = function (beforeCallback, afterCallback, extra) {
            counter++;
            $.get(_getRequestUrl(), function () {
                if (counter === options.repeat.finish) {
                    _hideLoadMoreButton();
                }
                if (typeof window[beforeCallback] === 'function') {
                    window[beforeCallback](extra);
                }
            }).done(function (response) {
                if (typeof window[afterCallback] === 'function') {
                    window[afterCallback](response, extra);
                }
                _finalProcess();
            });
        };

        _finalProcess = function () {
            _calculateSelector();
            isLoading = false;
        };

        _getRequestUrl = function () {
            return _getSelectorButton().data('url')
                + '?limit=' + (counter * options.limit.total)
                + '&' + _getSelectorButton().data('url-append');
        };

        _calculateSelector = function () {
            _setSelectorHeight(_getSelector().offset().top);
        };

        _appendTarget = function (response) {
            _getLoadSelector().before(response);
        };

        _showLoadMoreButton = function () {
            isLoadedMoreButton = true;
            _getSelectorButton().show();
            _onClickButton();
        };

        _hideLoadMoreButton = function () {
            _getSelectorButton().hide();
        };

        _onClickButton = function () {
            _getSelectorButton().on('click', function () {
                if (counter < options.repeat.finish) {
                    _doRequest(null, '_appendTarget');
                }
            });
        };

        _setSelectorHeight = function (top) {
            selectorHeight.top = top;
        };

        _log = {
            info: function (message) {
                this.logPrint('info', message);
            },
            log: function (message) {
                this.logPrint('log', message);
            },
            warn: function (message) {
                this.logPrint('warn', message);
            },
            error: function (message) {
                this.logPrint('error', message);
            },
            logPrint: function (type, message) {
                if (options.debug) {
                    console[type](message);
                }
            }
        };
    };
}(jQuery));
