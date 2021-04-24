"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _eventHub = _interopRequireDefault(require('./../common/eventHub.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = {
  router: [],
  route: {
    path: '',
    params: {},
    query: {},
    index: 0
  },
  done: function done(scope) {
    var _this = this;

    _eventHub["default"].$on('router:change', scope['router:change:eventHandler'] = function (v) {
      var _scope$$router$router, _this$router;

      v.router.length > 10 && v.router.shift(); //不要超过10个
      // console.log('router:change:geted',scope.$is,scope.$router.router.length);

      (_scope$$router$router = scope.$router.router).splice.apply(_scope$$router$router, [0, scope.$router.router.length].concat(_toConsumableArray(v.router))); //scope.$router是当前逐渐里的对象


      (_this$router = _this.router).splice.apply(_this$router, [0, _this.router.length].concat(_toConsumableArray(v.router))); //这里this是原始对象


      Object.assign(scope.$route, v.route);
      Object.assign(_this.route, v.route); // console.log('route:changed',scope.$route,scope);
    }); // eventHub.$on('router:offsetChange',scope['router:offsetChange:eventHandler'] = (v) => {
    //     Object.assign(scope.$route,this.router[this.router.length - 1 + v]);
    //     Object.assign(this.route,this.router[this.router.length - 1 + v]);
    //     scope.$router.router.splice(scope.$router.router.length + v);
    //     // this.router.splice(this.router.length + v);
    // });

  },
  disDone: function disDone(scope) {
    // console.log('router:disDone:geted',scope.$is,eventHub._events['$store:change'].length);
    _eventHub["default"].$off('router:change', scope['router:change:eventHandler']);

    delete scope['router:change:eventHandler']; // eventHub.$off('router:offsetChange',scope['router:offsetChange:eventHandler']);
    // delete scope['router:offsetChange:eventHandler'];
  },
  go: function go(offset) {
    this.router.splice(this.router.length + offset);
    Object.assign(this.route, this.router[this.router.length - 1]); // eventHub.$emit('router:offsetChange',offset);

    _eventHub["default"].$emit('router:change', this);
  },
  getCurrentPath: function getCurrentPath() {
    return this.router[this.router.length - 1];
  },
  push: function push(route) {
    //这里修改的是当前组建的router对象
    if (Object.prototype.toString.call(route) == "[object String]") {
      this.route.path = route;
      this.router.push({
        path: route
      });
    } else if (Object.prototype.toString.call(route) == "[object Object]") {
      this.route.path = route.path;
      this.router.push(route);
    } // console.log('router:push:emit');


    _eventHub["default"].$emit('router:change', this);
  }
};
exports["default"] = _default;