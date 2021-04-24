/**
 * Created by Administrator on 2018/4/17 0017.
 */
var IScroll = require('./export');
;(function ($) {
    var Carousel = function ($wrapper, options) {
        this.$wrapper = $wrapper;
        this.$scroller = this.$wrapper.find('.jsc-carousel-scroller');
        this.$sections = this.$scroller.children('.jsc-carousel-section');
        this.$images = this.$sections.find('img');
        this.indexCurrent = 0;

        this.iscroll = null;
        this.loop = options.loop;
        this.momentum = options.momentum;
        this.bounce = options.loop ? false : options.bounce;
        this.bounceTime = options.bounceTime;

        this.init();
    };
    Carousel.prototype = {
        init: function () {
            this.prepare();
            this.resize();
            this.initIScroll();
            this.bindEvents();
        },
        bindEvents: function () {
            var _self = this;

            // For not allow select image
            this.$images.on('mousemove', function (e) {
                e.preventDefault();
            });
            this.iscroll.on('scrollEnd', function (e) {
                if (_self.loop) {
                    _self.scrollForLoop(e);
                }

                _self.indexCurrent = _self.iscroll.currentPage.pageX;
            });
        },
        prepare: function () {
            this.$sections.css('float', 'left');
            this.$wrapper.css('overflow', 'hidden');
            this.$scroller.after($('<div>').css({
                margin: 0,
                padding: 0,
                height: 0,
                overflow: 'hidden',
                clear: 'body'
            }));

            if (this.loop){
                this.$scroller
                    .append(this.$sections.clone())
                    .append(this.$sections.clone());

                this.$sections = this.$scroller.children('.jsc-carousel-section');
                this.$images = this.$sections.find('img');
            }
        },
        initIScroll: function () {
            this.iscroll = new IScroll(this.$wrapper[0], {
                snap: this.$sections,
                bounce: this.bounce,
                bounceTime: this.bounceTime,
                useTransform : !!window.WebSocket,
                momentum: this.momentum,
                scrollY: false,
                scrollX: true,
                eventPassthrough: true,
                probeType: 3
            });

            if (this.loop) {
                this.iscroll.goToPage(this.$sections.length / 3, 0, 0);
                this.indexCurrent = this.iscroll.currentPage.pageX;
            }
        },
        resize: function () {
            var
                widthSections = this.$wrapper.width(),
                widthScroller = widthSections * this.$sections.length;

            this.$sections.width(widthSections);
            this.$scroller.width(widthScroller);
        },
        scrollForLoop: function (e) {
            var
                indexFirstPage = this.$sections.length / 3,
                indexLastPage = (indexFirstPage * 2) - 1,
                nearestPageX = this.iscroll._nearestSnap(this.iscroll.x, 0).pageX,
                widthOneLoop = this.$sections.eq(indexFirstPage * 2).position().left - this.$sections.eq(indexFirstPage).position().left;
            var self = this;
            setTimeout(function () {
              if (self.indexCurrent < indexFirstPage) {
                self.iscroll.goToPage(self.indexCurrent+indexFirstPage,0,0);
              }

              if (self.indexCurrent > indexLastPage) {
                self.iscroll.goToPage(self.indexCurrent-indexFirstPage,0,0);
              }
            },10);
        }
    };
    $.fn.carousel = function (settings) {
        var options = $.extend({
            bounce: false,
            bounceTime: 500,
            momentum: true,
            loop: false
        }, settings);

        var ret = null;

        this.each(function () {
          ret = new Carousel($(this), options);
        });
        return ret;
    };
})(Zepto);
