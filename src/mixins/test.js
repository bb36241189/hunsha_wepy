let showSubscribeMessage = true;
let isHasSign = false;
let wxDraw = null;
let Shape = null;
let hasAnswerBookChange = true;

import eventHub from '../common/eventHub';
import store from '../store/store';
import router from '../router/router';
import config from '../js/config';


Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


export default {
  data: {
    mixin: 'MixinText',
    sysInfo: {},
    custom: 0,
    img_url: 'https://nqobaxsg.cn/star-info/dist/img/',
    customBar: 0,
    $store: store,
    $router: router,
    $route: router.route
  },
  methods: {
    setHasAnswerBookChange(bool){
      hasAnswerBookChange = bool;
    },
    getHasAnswerBookChange(){
      return hasAnswerBookChange;
    },
    setShowSubscribeMessage(bool) {
      showSubscribeMessage = bool;
    },
    getShowSubscribeMessage() {
      return showSubscribeMessage;
    },
    setWxDraw(wd){
      wxDraw = wd;
    },
    getWxDraw(){
      return wxDraw;
    },
    setShape(sp){
      Shape = sp;
    },
    getShape(){
      return Shape;
    },
    setIsHasSign(bool) {
      isHasSign = bool;
    },
    getIsHasSign() {
      return isHasSign;
    },
    getUserInfo(){
      return new Promise((r,j) => {
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action : 'getUserInfo',
          },
          success: res => {
            if(res.result.data.length){
              r(res.result.data[0])
            }else{
              j(res);
            }
            // console.log(`[subDailyWeatherCloudFn] => OK => ${res}`)
          },
          fail: err => {
            j(err);
            // console.log(`[subDailyWeatherCloudFn] => Fail => ${err}`)
          }
        })
      });
    },
    handleSubscribeMsg(form_id,complateFunc = function(){},successFunc = function(){},failFunc = function(){}) {
      if (!this.getShowSubscribeMessage()) {
        complateFunc();
        return;
      }
      wx.showLoading({
        title: '加载中...'
      });
      return new Promise((r, j) => {
        let func = wx.requestSubscribeMessage || wx.subscribeAppMsg;
        func({
          tmplIds: [config.subscribe_tmpl_id],
          subscribe: true,
          success(res) {
            console.log('requestSubscribeMessage:', res);
            if (
              res[config.subscribe_tmpl_id] == 'accept'
            ) {
              r(res);
            } else {
              j(res);
            }
          },
          fail(e) {
            j(e);
          }
        });
      })
        .then(() => {
          return this.saveSubscribeMessage(form_id,successFunc,failFunc);
        }).then(() => {
          complateFunc();
        })
        .catch(e => {
          wx.hideLoading();
          failFunc();
          complateFunc();
          console.log(e);
        });
    },
    saveSubscribeMessage(form_id,successFunc, failFunc) {
      return new Promise((r, j) => {
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'saveSubscribeMessage',
            date: new Date().Format('yyyy-MM-dd'),
            form_id,
            done: false
          },
          success: res => {
            wx.hideLoading({
              success: () => {
                wx.showToast({
                  title: '订阅成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                });
                successFunc();
                r(res);
                this.setShowSubscribeMessage(false);
              }
            });
            console.log(`[subDailyWeatherCloudFn] => OK => ${res}`);
          },
          fail: err => {
            wx.hideLoading();
            failFunc();
            j(err);
            console.log(`[subDailyWeatherCloudFn] => Fail => ${err}`);
          }
        });
      });
    },
    mixintap() {
      this.mixin = 'MixinText' + (Math.random() + '').substring(3, 7);
      console.log('mixin method tap');
    },
    _request(config) {
      !config.header && (config.header = {})
      Object.assign(config.header, {
        sessiontoken: token,
        channel: 2
      });
      return new Promise((r, j) => {
        wx.request(Object.assign({}, {
          success: function (ret) {
            r(ret);
          },
          fail: function (error) {
            j(error);
          }
        }, config))
      })
    },
    getClipboardData() {
      return new Promise((r, j) => {
        wx.getClipboardData({
          success(res) {
            r(res.data);
          }
        })
      })
    },
    getSysInfo() {
      return this.sysInfo;
    },
    getSafeArea() {
      let sys = this.getSysInfo();
      if (!sys.safeArea) {
        sys.safeArea = {
          bottom: 667,
          height: 667,
          left: 0,
          right: 375,
          top: 0,
          width: 375
        }
      }
      var rate = 750 / sys.safeArea.width;
      return {
        bottom: sys.safeArea.bottom * rate,
        height: sys.safeArea.height * rate,
        left: sys.safeArea.left * rate,
        right: sys.safeArea.right * rate,
        top: sys.safeArea.top * rate,
        width: sys.safeArea.width * rate,
        bs: sys.safeArea.top > 30 ? sys.safeArea.top : 0
      }
    },
  },
  computed: {
    safeArea() {
      return this.getSafeArea();
    },
    isiOS() {
      // return false;
      return this.sysInfo.system ? this.sysInfo.system.toLowerCase().indexOf('ios') > -1 : true;
    }
  },
  detached(){
    store.disDone(this);
    router.disDone(this);
    // setTimeout(() => {
    //   delete this.$router;;
    //   delete this.$route;
    //   delete this.BUS;
    //   delete this.$store;
    // },2000);
  },
  created() {
    store.done(this);
    router.done(this);
    this.BUS = eventHub;
    wx.getSystemInfo({
      success: e => {
        // Object.assign(this.sysInfo,e);
        this.sysInfo = e;
        // if(this.sysInfo.version && this.sysInfo.version < '7.0.9'){
        //   wx.showToast({
        //     title: '当前微信版本过低，请升级微信版本',
        //     icon: 'none',
        //     duration: 2000
        //   });
        // }
        this.statusBar = e.statusBarHeight; //状态栏高度
        let custom = wx.getMenuButtonBoundingClientRect();//菜单按钮
        this.custom = custom;
        this.customBar = (custom.bottom + custom.top) / 2;
      }
    });
  }
}
 