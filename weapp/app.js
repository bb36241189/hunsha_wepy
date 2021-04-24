"use strict";

var _core = _interopRequireDefault(require('./vendor.js')(0));

var _test = _interopRequireDefault(require('./mixins/test.js'));

var _CommonEnv = _interopRequireDefault(require('./js/class/CommonEnv.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import eventHub from './common/eventHub';
_core["default"].app({
  hooks: {
    // App 级别 hook，对整个 App 生效
    // 同时存在 Page hook 和 App hook 时，优先执行 Page hook，返回值再交由 App hook 处
    'before-setData': function beforeSetData(dirty) {
      return dirty;
    }
  },
  globalData: {
    userInfo: null
  },
  mixins: [_test["default"]],
  onLaunch: function onLaunch() {},
  onHide: function onHide() {},
  methods: {}
}, {info: {"noPromiseAPI":["createSelectorQuery"]}, handlers: {}, models: {}, refs: undefined });