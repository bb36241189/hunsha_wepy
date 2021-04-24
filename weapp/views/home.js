"use strict";

var _apiService = _interopRequireDefault(require('./../js/apiService.js'));

var _urlTool = _interopRequireDefault(require('./../js/lib/urlTool.js'));

var _test = _interopRequireDefault(require('./../mixins/test.js'));

var _CommonEnv = _interopRequireDefault(require('./../js/class/CommonEnv.js'));

var _core = _interopRequireDefault(require('./../vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  name: "starInfo",
  mixins: [_test["default"]],
  data: {
    cards: null,
    showRecord: false,
    starTopInfo: null,
    isWXMiniApp: false,
    daySign: null,
    carouselTime: 0,
    products: null,
    showGetTarotDaren: false
  },
  methods: {},
  watch: {},
  computed: {
    nowTab: function nowTab() {
      return this.$store.state.nowTab;
    }
  },
  created: function created() {},
  ready: function ready() {}
}, {info: {"components":{},"on":{}}, handlers: {}, models: {}, refs: undefined });