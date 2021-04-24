"use strict";

var _config = _interopRequireDefault(require('./../js/config.js'));

var _urlTool = _interopRequireDefault(require('./../js/lib/urlTool.js'));

var _apiService = _interopRequireDefault(require('./../js/apiService.js'));

var _CommonEnv = _interopRequireDefault(require('./../js/class/CommonEnv.js'));

var _core = _interopRequireDefault(require('./../vendor.js')(0));

var _test = _interopRequireDefault(require('./../mixins/test.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//   import PinkApi from '../utils/PinkApi';
;
;
;
;

_core["default"].page({
  mixins: [_test["default"]],
  name: "home",
  data: {
    page: 1,
    title_text: "不同的占卜类型，对应不同的牌阵组合哦~",
    prevCard: null,
    isOrdered: false,
    nowCard: null,
    nextCard: null,
    getedNum: 0
  },
  methods: {
    getedCard: function getedCard(card) {
      var _this = this;

      console.log(card);
      this.getedNum++;

      if (!this.prevCard) {
        this.prevCard = card;
      } else if (!this.nowCard) {
        this.nowCard = card;
      } else if (!this.nextCard) {
        this.nextCard = card;
        setTimeout(function () {
          return _apiService["default"].orderLock(_this.getUrlParam('order_id'), _this.prevCard.name + ',' + _this.nowCard.name + ',' + _this.nextCard.name).then(function (ret) {
            // UrlTool.gotoHrefWithParam("cardGetedEnd.html", {
            //     prev: this.prevCard.name,
            //     now: this.nowCard.name,
            //     next: this.nextCard.name
            // },true);
            wx.redirectTo({
              url: _urlTool["default"].getUrlByParamsObj('/sub_tarot/cardGetedEnd', Object.assign({
                prev: _this.prevCard.name,
                now: _this.nowCard.name,
                next: _this.nextCard.name
              }, _this.options))
            });
          })["catch"](function (e) {
            console.error(e);

            _CommonEnv["default"].toast('塔罗师正忙，稍后再试试喔~');
          }); //   global.location.replace(
          //     "cardGetedEnd.html?prev=" +
          //     this.prevCard[1].name +
          //     "&now=" +
          //     this.nowCard[1].name +
          //     "&next=" +
          //     this.nextCard[1].name +
          //     "&title_text=" +
          //     this.title_text +
          //     "&v=" + this.getUrlParam('v') +
          //     '&outer=' + (this.getUrlParam("outer") || '') + '&trenchId=' + this.getUrlParam('trenchId'))
        }, 500);
      } //   console.log(card);

    },
    getUrlParam: function getUrlParam(name) {
      //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      //   var r = global.location.search.substr(1).match(reg);
      //   if (r != null) return decodeURIComponent(r[2]);
      return this.options[name];
    }
  },
  onLoad: function onLoad(options) {
    var _this2 = this;

    this.options = options;
    this.title_text = this.getUrlParam("title"); // require.ensure([],() => {
    //     CommonEnv.judgeIsInWeixin() &&  require('./wxshare');
    // })

    _apiService["default"].getAuguryOrderByOrderId(this.getUrlParam('order_id'), true).then(function (ret) {
      console.log('onLoad getAuguryOrder:', ret);

      if (ret.length) {
        _this2.isOrdered = true;
      } else {
        _CommonEnv["default"].toast('还没有下单喔~');
      }
    })["catch"](function (e) {
      console.error(e);
    });
  }
}, {info: {"components":{},"on":{}}, handlers: {'11-0': {"getedCard": function proxy () {
  var $wx = arguments[arguments.length - 1].$wx;
  var $event = ($wx.detail && $wx.detail.arguments) ? $wx.detail.arguments[0] : arguments[arguments.length -1];
  var $args = $wx.detail && $wx.detail.arguments;
  var _vm=this;
  return (function () {
    _vm.getedCard.apply(_vm, $args || [$event]);
  })();
}}}, models: {}, refs: undefined });