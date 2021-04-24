/**
 * Created by Administrator on 2018/4/8 0008.
 */
function IScrollSwiper(scrollWrapperSelector,scrollerSelector,cursorSelector) {
  var self = this;
  this.scrollWrapper = $(scrollWrapperSelector);
  var jq = $(scrollerSelector);
  var jq2 = $(cursorSelector).children();
  var timerMachine = null;
  this.dataLength = jq2.length;
  jq.css({
    width: $(this.scrollWrapper).width() * this.dataLength
  });

  this.bannerScroller = $(this.scrollWrapper).carousel({
    scrollX: true,
    bounce: false,
    snap: true,
    bounceEasing : '',
    loop : true,
    momentum : false,
    click : true,
    probeType: 2
  }).iscroll;


  function TimeMachine() {
    this.timer = null;
    this.timeout = 5000;
    var self = this;
    this.timer = setTimeout(function () {
      self.fn();
    },self.timeout)
  }
  TimeMachine.prototype = {
    resetTimer : function () {
      var the = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        the.fn.call(the);
      }, this.timeout);
    },
    fn : function () {
      var page = (self.bannerScroller.currentPage.pageX+1)%(self.dataLength*3),the = this;
      self.bannerScroller.goToPage(page, 0, 1000);
      this.timer = setTimeout(function () {
        the.fn.call(the);
      },this.timeout);
    }
  };
  // timerMachine = new TimeMachine();
  self.bannerScroller.on('scroll', function () {
    // timerMachine.resetTimer();
    jq2.hide();
    jq2[this.currentPage.pageX%self.dataLength].style.display = '';
  });
  self.bannerScroller.on('scrollEnd', function () {
    jq2.hide();
    jq2[this.currentPage.pageX%self.dataLength].style.display = '';
  });
  jq2[0].style.display = '';
}
IScrollSwiper.prototype = {
  constructor : IScrollSwiper
};
module.exports = IScrollSwiper;

