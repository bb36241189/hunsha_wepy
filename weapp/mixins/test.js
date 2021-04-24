"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _eventHub = _interopRequireDefault(require('./../common/eventHub.js'));

var _store = _interopRequireDefault(require('./../store/store.js'));

var _router = _interopRequireDefault(require('./../router/router.js'));

var _config = _interopRequireDefault(require('./../js/config.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var showSubscribeMessage = true;
var isHasSign = false;
var wxDraw = null;
var Shape = null;
var hasAnswerBookChange = true;

Date.prototype.Format = function (fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1,
    //月份
    "d+": this.getDate(),
    //日
    "h+": this.getHours(),
    //小时
    "m+": this.getMinutes(),
    //分
    "s+": this.getSeconds(),
    //秒
    "q+": Math.floor((this.getMonth() + 3) / 3),
    //季度
    "S": this.getMilliseconds() //毫秒

  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }

  return fmt;
};

var _default = {
  data: {
    mixin: 'MixinText',
    sysInfo: {},
    custom: 0,
    img_url: 'https://nqobaxsg.cn/star-info/dist/img/',
    customBar: 0,
    $store: _store["default"],
    $router: _router["default"],
    $route: _router["default"].route
  },
  methods: {
    setHasAnswerBookChange: function setHasAnswerBookChange(bool) {
      hasAnswerBookChange = bool;
    },
    getHasAnswerBookChange: function getHasAnswerBookChange() {
      return hasAnswerBookChange;
    },
    setShowSubscribeMessage: function setShowSubscribeMessage(bool) {
      showSubscribeMessage = bool;
    },
    getShowSubscribeMessage: function getShowSubscribeMessage() {
      return showSubscribeMessage;
    },
    setWxDraw: function setWxDraw(wd) {
      wxDraw = wd;
    },
    getWxDraw: function getWxDraw() {
      return wxDraw;
    },
    setShape: function setShape(sp) {
      Shape = sp;
    },
    getShape: function getShape() {
      return Shape;
    },
    setIsHasSign: function setIsHasSign(bool) {
      isHasSign = bool;
    },
    getIsHasSign: function getIsHasSign() {
      return isHasSign;
    },
    getUserInfo: function getUserInfo() {
      return new Promise(function (r, j) {
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'getUserInfo'
          },
          success: function success(res) {
            if (res.result.data.length) {
              r(res.result.data[0]);
            } else {
              j(res);
            } // console.log(`[subDailyWeatherCloudFn] => OK => ${res}`)

          },
          fail: function fail(err) {
            j(err); // console.log(`[subDailyWeatherCloudFn] => Fail => ${err}`)
          }
        });
      });
    },
    handleSubscribeMsg: function handleSubscribeMsg(form_id) {
      var _this = this;

      var complateFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var successFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
      var failFunc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

      if (!this.getShowSubscribeMessage()) {
        complateFunc();
        return;
      }

      wx.showLoading({
        title: '加载中...'
      });
      return new Promise(function (r, j) {
        var func = wx.requestSubscribeMessage || wx.subscribeAppMsg;
        func({
          tmplIds: [_config["default"].subscribe_tmpl_id],
          subscribe: true,
          success: function success(res) {
            console.log('requestSubscribeMessage:', res);

            if (res[_config["default"].subscribe_tmpl_id] == 'accept') {
              r(res);
            } else {
              j(res);
            }
          },
          fail: function fail(e) {
            j(e);
          }
        });
      }).then(function () {
        return _this.saveSubscribeMessage(form_id, successFunc, failFunc);
      }).then(function () {
        complateFunc();
      })["catch"](function (e) {
        wx.hideLoading();
        failFunc();
        complateFunc();
        console.log(e);
      });
    },
    saveSubscribeMessage: function saveSubscribeMessage(form_id, successFunc, failFunc) {
      var _this2 = this;

      return new Promise(function (r, j) {
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'saveSubscribeMessage',
            date: new Date().Format('yyyy-MM-dd'),
            form_id: form_id,
            done: false
          },
          success: function success(res) {
            wx.hideLoading({
              success: function success() {
                wx.showToast({
                  title: '订阅成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                });
                successFunc();
                r(res);

                _this2.setShowSubscribeMessage(false);
              }
            });
            console.log("[subDailyWeatherCloudFn] => OK => ".concat(res));
          },
          fail: function fail(err) {
            wx.hideLoading();
            failFunc();
            j(err);
            console.log("[subDailyWeatherCloudFn] => Fail => ".concat(err));
          }
        });
      });
    },
    mixintap: function mixintap() {
      this.mixin = 'MixinText' + (Math.random() + '').substring(3, 7);
      console.log('mixin method tap');
    },
    _request: function _request(config) {
      !config.header && (config.header = {});
      Object.assign(config.header, {
        sessiontoken: token,
        channel: 2
      });
      return new Promise(function (r, j) {
        wx.request(Object.assign({}, {
          success: function success(ret) {
            r(ret);
          },
          fail: function fail(error) {
            j(error);
          }
        }, config));
      });
    },
    getClipboardData: function getClipboardData() {
      return new Promise(function (r, j) {
        wx.getClipboardData({
          success: function success(res) {
            r(res.data);
          }
        });
      });
    },
    getSysInfo: function getSysInfo() {
      return this.sysInfo;
    },
    getSafeArea: function getSafeArea() {
      var sys = this.getSysInfo();

      if (!sys.safeArea) {
        sys.safeArea = {
          bottom: 667,
          height: 667,
          left: 0,
          right: 375,
          top: 0,
          width: 375
        };
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
      };
    }
  },
  computed: {
    safeArea: function safeArea() {
      return this.getSafeArea();
    },
    isiOS: function isiOS() {
      // return false;
      return this.sysInfo.system ? this.sysInfo.system.toLowerCase().indexOf('ios') > -1 : true;
    }
  },
  detached: function detached() {
    _store["default"].disDone(this);

    _router["default"].disDone(this); // setTimeout(() => {
    //   delete this.$router;;
    //   delete this.$route;
    //   delete this.BUS;
    //   delete this.$store;
    // },2000);

  },
  created: function created() {
    var _this3 = this;

    _store["default"].done(this);

    _router["default"].done(this);

    this.BUS = _eventHub["default"];
    wx.getSystemInfo({
      success: function success(e) {
        // Object.assign(this.sysInfo,e);
        _this3.sysInfo = e; // if(this.sysInfo.version && this.sysInfo.version < '7.0.9'){
        //   wx.showToast({
        //     title: '当前微信版本过低，请升级微信版本',
        //     icon: 'none',
        //     duration: 2000
        //   });
        // }

        _this3.statusBar = e.statusBarHeight; //状态栏高度

        var custom = wx.getMenuButtonBoundingClientRect(); //菜单按钮

        _this3.custom = custom;
        _this3.customBar = (custom.bottom + custom.top) / 2;
      }
    });
  }
};
exports["default"] = _default;