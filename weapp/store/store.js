"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apiService = _interopRequireDefault(require('./../js/apiService.js'));

var _eventHub = _interopRequireDefault(require('./../common/eventHub.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Created by Administrator on 2018/9/13 0013.
 */
var _default = {
  state: {
    starInfo: null,
    cStar: null,
    //本地存储的星座选择信息的恢复
    userInfo: null,
    //用户信息
    nowTab: 'day',
    //星座运势的哪一个tab页
    wxConfig: null //微信配置数据对象

  },
  mutations: {
    changeStarInfo: function changeStarInfo(state, v) {
      state.starInfo = v;
    },
    changeWxConfig: function changeWxConfig(state, v) {
      state.wxConfig = v;
    },
    changeCStar: function changeCStar(state, v) {
      state.cStar = v;
    },
    changeUserInfo: function changeUserInfo(state, v) {
      state.userInfo = v;
    },
    changeNowTab: function changeNowTab(state, v) {
      state.nowTab = v;
    }
  },
  done: function done(scope) {
    var _this = this;

    _eventHub["default"].$on('$store:change', scope['$store:change:eventHandler'] = function (v) {
      Object.assign(scope.$store.state, v);
      Object.assign(_this.state, v); // console.log('eventBus:$store:change',scope.$is)
    });
  },
  disDone: function disDone(scope) {
    _eventHub["default"].$off('$store:change', scope['$store:change:eventHandler']);

    delete scope['$store:change:eventHandler'];
  },
  commit: function commit(k, v) {
    if (this.mutations[k]) {
      this.mutations[k](this.state, v);

      _eventHub["default"].$emit('$store:change', this.state);
    }
  },
  dispatch: function dispatch(k, v) {
    if (this.actions[k]) {
      this.actions[k]({
        commit: this.commit.bind(this),
        state: this.state,
        dispatch: this.dispatch.bind(this)
      }, v);
    }
  },
  getters: {
    doubleCount: function doubleCount(state) {
      return state.count * 2;
    }
  },
  actions: {
    loadStarInfo: function loadStarInfo(_ref, starKey) {
      var commit = _ref.commit;
      wx.showLoading({
        title: '加载中'
      });
      return _apiService["default"].getStarInfo(starKey).then(function (ret) {
        commit('changeStarInfo', ret);
        wx.hideLoading();
      })["catch"](function (e) {
        console.error(e);
        wx.hideLoading();
      });
    },
    getSdkSign: function getSdkSign(_ref2) {
      var commit = _ref2.commit;
      return _apiService["default"].getSdkSign().then(function (ret) {
        commit('changeWxConfig', ret);
      })["catch"](function (e) {
        console.error(e);
      });
    },
    starLoginWxMiniPro: function starLoginWxMiniPro(_ref3) {
      var commit = _ref3.commit,
          state = _ref3.state;

      _apiService["default"].starLoginWxMiniPro(state.cStar.key).then(function (ret) {
        if (ret) {
          // CommonEnv.toast('登录成功!');
          commit("changeUserInfo", ret);
          _apiService["default"].token = ret.token;
          wx.setStorageSync('token', _apiService["default"].token);
        } else {
          return Promise.reject({
            msg: 'login lost'
          });
        }
      })["catch"](function (e) {
        console.error(e);
      });
    },
    login: function login(_ref4) {
      var commit = _ref4.commit,
          dispatch = _ref4.dispatch;
      return _apiService["default"].tokenLogin().then(function (ret) {
        if (!ret.code) {
          commit('changeUserInfo', ret);
        } else {
          return Promise.reject(ret);
        }
      })["catch"](function (e) {
        if (e.code && e.code == 103) {
          wx.removeStorageSync('token');
          delete _apiService["default"].token;
          dispatch('starLoginWxMiniPro'); //token失效就重新登录
        } else {
          console.error(e);
        }
      });
    }
  }
};
exports["default"] = _default;