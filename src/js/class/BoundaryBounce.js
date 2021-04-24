/**
 * Created by Administrator on 2018/4/21 0021.
 */
const Pubsub = require('../lib/Pubsub');
function BoundaryBounce(scrollWrapper,scroller){
  Pubsub.call(this);
  this.$scrollWrapper = $(scrollWrapper);
  this.$scroller = scroller?$(scroller):this.getScroller();
  this.scrollTimer = null;
  this.scrollStatus = 'static';//pullDown,pullUp,move
  this.lastY = null;
  this.moveLengthY = 0;
}
BoundaryBounce.prototype = Object.create(Pubsub.prototype);
Object.assign(BoundaryBounce.prototype,{
  constructor : BoundaryBounce,
  getScroller : function () {
    var ret = null;
    this.$scrollWrapper.children().forEach(function (ele) {
      var $ele = $(ele);
      if($ele.css('display') !== 'none'){
        ret = $ele;
      }
    });
    return ret;
  },
  scroll2Bottom : function (px){
    !px && (px = 300);
    var speed = px/50,goPx = 0,timer,self =this;
    timer = setInterval(function () {
      if(goPx === px){
        clearInterval(timer);
      }else{
        self.$scrollWrapper.scrollTop(self.$scrollWrapper.scrollTop()+speed);
        goPx+=speed;
      }
    },20)
  },
  handleBounceY : function(e){
    var clientY = this.getTouchClient(e).y;
    this.moveLengthY += (clientY-this.lastY);
    this.$scrollWrapper.css({
      transform : 'translateY('+this.moveLengthY/3+'px)',
      transition : ''
    });
  },
  getTouchClient : function(e) {
    if (e.touches && e.touches[0]) {
      return {x: e.touches[0].clientX, y: e.touches[0].clientY};
    } else if (e.changedTouches && e.changedTouches[0]) {
      return {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
    }
    return {x: e.clientX, y: e.clientY};
  },
  resetBounce : function() {
    this.moveLengthY = 0;
    this.$scrollWrapper.css({
      transform : 'translateY(0)',
      transition : 'transform 0.3s ease-out'
    });
    if(this.scrollStatus === 'pullDown'){
      this.trigger('pullDownRelease');
    }else if(this.scrollStatus === 'pullUp'){
      this.trigger('pullUpRelease');
    }
  },
  handleTouchBoundary : function(event){
    var y = this.getTouchClient(event).y;
    var st = this.$scrollWrapper.scrollTop(); //滚动条高度
    if (y >= this.lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
      // this.handleBounceY(event);
      this.scrollStatus = 'pullDown';
      event.preventDefault();
    } else if (y <= this.lastY && st+20 >= this.$scroller.height() - this.$scrollWrapper.height()) {
      // this.handleBounceY(event);
      this.scrollStatus = 'pullUp';
      event.preventDefault();
    }else{
      this.scrollStatus = 'move';
    }
    this.lastY = y;
  },
  bindEvent : function(){
    var self = this;
    this.$scrollWrapper.on('touchstart', function (event) {
      self.lastY = self.getTouchClient(event).y;//点击屏幕时记录最后一次Y度坐标。
    }).on('touchmove', function (event) {
      self.handleTouchBoundary(event);
    }).on('touchend',function (event) {
      // self.resetBounce();
    }).on('scroll', function (e) {
      // if (self.scrollTimer) {
      //   clearTimeout(self.scrollTimer);
      // }
      // self.scrollTimer = setTimeout(function () {
      //   if (self.$scrollWrapper.scrollTop() + 10 >= self.$scroller.height() - document.documentElement.getBoundingClientRect().height) {
      //     self.trigger('scroll2end',function () {
      //       self.resetBounce();
      //     });
      //   }
      // }, 200);
    })
  }

});
module.exports = BoundaryBounce;
