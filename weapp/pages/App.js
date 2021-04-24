"use strict";

var _apiService = _interopRequireDefault(require('./../js/apiService.js'));

var _CommonEnv = _interopRequireDefault(require('./../js/class/CommonEnv.js'));

var _core = _interopRequireDefault(require('./../vendor.js')(0));

var _test = _interopRequireDefault(require('./../mixins/test.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].page({
  mixins: [_test["default"]],
  data: {
    nowBottomTab: "",
    //Diary,Mine
    showLogin: false,
    editData: null,
    onShareStartTime: 0,
    isChangingStar: false,
    showRecord: false
  },
  watch: {
    nowBottomTab: function nowBottomTab(v) {
      if (v == "home" && this.$route.path != "/home") {
        this.$router.push({
          path: "/home"
        });
      } else if (v == "order" && this.$route.path != "/order") {
        this.$router.push({
          path: "/order"
        });
      } else if (v == "zhuchu" && this.$route.path != "/zhuchu") {
        this.$router.push({
          path: '/zhuchu'
        });
      } else if (v == "guihuan" && this.$route.path != "/guihuan") {
        this.$router.push({
          path: '/guihuan'
        });
      } else if (v == "wode" && this.$route.path != "/wode") {
        this.$router.push({
          path: '/wode'
        });
      }
    },
    $route: function $route(to, from) {
      if (to.path == '/home') {
        this.nowBottomTab = 'home';
      } else if (to.path == '/order') {
        this.nowBottomTab = 'order';
      } else if (to.path == '/zhuchu') {
        this.nowBottomTab = 'zhuchu';
      } else if (to.path == '/guihuan') {
        this.nowBottomTab = 'guihuan';
      } else if (to.path == '/wode') {
        this.nowBottomTab = 'wode';
      }
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    console.log('onShareAppMessage...');
    this.onShareStartTime = Date.now();
    return {
      title: '萝卜星座屋',
      imageUrl: 'https://nqobaxsg.cn/logo.jpg',
      desc: '从星座的角度带你看清现状和未来',
      path: '/pages/App' // 路径，传递参数到指定页面。

    };
  },
  computed: {
    nowTab: function nowTab() {
      return this.$store.state.nowTab;
    }
  },
  methods: {
    goLogin: function goLogin() {
      this.$store.dispatch('starLoginWxMiniPro');
    }
  },
  onShow: function onShow() {
    // this.BUS.$emit('openPickerDate');
    if (!this.nowBottomTab) {
      this.nowBottomTab = 'home';
    }
  },
  created: function created() {}
}, {info: {"components":{"routerView":{"path":"./../router/routerView"}},"on":{}}, handlers: {'10-0': {"tap": function proxy () {
    var _vm=this;
  return (function () {
    _vm.nowBottomTab = 'home';
  })();
}},'10-1': {"tap": function proxy () {
    var _vm=this;
  return (function () {
    _vm.nowBottomTab = 'order';
  })();
}},'10-2': {"tap": function proxy () {
    var _vm=this;
  return (function () {
    _vm.nowBottomTab = 'zhuchu';
  })();
}},'10-3': {"tap": function proxy () {
    var _vm=this;
  return (function () {
    _vm.nowBottomTab = 'guihuan';
  })();
}},'10-4': {"tap": function proxy () {
    var _vm=this;
  return (function () {
    _vm.nowBottomTab = 'wode';
  })();
}},'10-5': {"closeMask": function proxy () {
  var $wx = arguments[arguments.length - 1].$wx;
  var $event = ($wx.detail && $wx.detail.arguments) ? $wx.detail.arguments[0] : arguments[arguments.length -1];
  var $args = $wx.detail && $wx.detail.arguments;
  var _vm=this;
  return (function () {
    _vm.closeLogin.apply(_vm, $args || [$event]);
  })();
}},'10-6': {"closeMask": function proxy () {
  var $wx = arguments[arguments.length - 1].$wx;
  var $event = ($wx.detail && $wx.detail.arguments) ? $wx.detail.arguments[0] : arguments[arguments.length -1];
  var $args = $wx.detail && $wx.detail.arguments;
  var _vm=this;
  return (function () {
    _vm.closeChoiceStar.apply(_vm, $args || [$event]);
  })();
}},'10-7': {"closeRecord": function proxy () {
  var $wx = arguments[arguments.length - 1].$wx;
  var $event = ($wx.detail && $wx.detail.arguments) ? $wx.detail.arguments[0] : arguments[arguments.length -1];
  var $args = $wx.detail && $wx.detail.arguments;
  var _vm=this;
  return (function () {
    _vm.closeRecord.apply(_vm, $args || [$event]);
  })();
}}}, models: {}, refs: undefined });