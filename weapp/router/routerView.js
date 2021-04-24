"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(0));

var _test = _interopRequireDefault(require('./../mixins/test.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  mixins: [_test["default"]],
  data: {
    currentRoute: ''
  },
  methods: {},
  watch: {
    '$route.path': function $routePath(v) {
      console.log('watch:$router', v);
      this.currentRoute = v;
    }
  },
  created: function created() {
    console.log('routerView:created', this.$router);

    if (this.$route.path) {
      this.currentRoute = this.$route.path;
    } // if(this.$router.length){
    //     this.$router.push(this.$router[this.$router.length - 1].path);
    // }else{
    //     this.$router.push('/starInfo');
    // }

  }
}, {info: {"components":{"home":{"path":"./../views/home"}},"on":{}}, handlers: {}, models: {}, refs: undefined });