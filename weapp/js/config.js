"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Created by Administrator on 2019/4/4 0004.
 */
var config = {
  serverBaseUrl: 'http://api.55zala.cn/gamecenter',
  // serverBaseUrl : SERVER_BASE_URL,
  // serverBaseUrl : 'http://column.mall.ffrj.net/course',
  // payUrl : 'http://payment.coin.ffrj.net/course/pay',
  subscribe_tmpl_id: '66cc3e19ce81375537a3655987d5c8e7',
  client_id: 169024,
  isNativeScroll: true,
  isDebug: false,
  remoteDebug: true,
  version: '1.00'
}; // if(config.isDebug || location.search.indexOf('debug=1314') > -1) {
//     window.vConsole = new window.VConsole();
// }

var _default = config;
exports["default"] = _default;