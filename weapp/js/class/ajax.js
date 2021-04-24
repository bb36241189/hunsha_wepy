"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by Administrator on 2018/1/30 0030.
 */
var config = require('./../config.js'); // var ajax = require('../lib/ajax/ajax');
// import $ from '../lib/zepto';


var timeout = 30000;

function AjaxService() {}

AjaxService.prototype = {
  constructor: AjaxService,

  /**
   * TODO
   */
  getLastServerTime: function getLastServerTime() {
    return Date.now();
  },
  handlerError: function handlerError(xhr, errorType, error) {
    if (xhr.responseText && xhr.responseText.indexOf('{') === 0 && xhr.responseText.indexOf('}') === xhr.responseText.length - 1) {
      return JSON.parse(xhr.responseText);
    } else if (xhr.responseText) {
      return JSON.stringify({
        message: xhr.responseText
      });
    } else if (error) {
      if (Object.prototype.toString.call(error) === "[object Object]") {
        return error;
      } else {
        return {
          message: error
        };
      }
    } else if (errorType) {
      if (errorType === 'abort') {
        return {
          message: '请求中断'
        };
      } else {
        return {
          message: errorType
        };
      } // return ({message : errorType});

    } else {
      return {
        message: '未知异常'
      };
    }
  },
  get: function get(options, isDebug) {
    var self = this;
    isDebug && alert('get' + JSON.stringify(options));
    var cpOpt = Object.assign({}, options);
    cpOpt.data = cpOpt.data || {};
    if (!cpOpt.noUid && !cpOpt.data.uid) cpOpt.data.uid = options.uid || '';

    if (!cpOpt.type) {
      cpOpt.type = 'json';
    }

    if (!(cpOpt.url.indexOf('http') === 0)) {
      cpOpt.url = config.serverBaseUrl + cpOpt.url;
    }

    return new Promise(function (r, j) {
      var _wx$request;

      wx.request((_wx$request = {
        url: cpOpt.url,
        //仅为示例，并非真实的接口地址
        data: options.data,
        header: cpOpt.headers,
        method: 'GET',
        timeout: timeout
      }, _defineProperty(_wx$request, "data", options.data), _defineProperty(_wx$request, "success", function success(res) {
        if (res.data.errorNo || res.data.code) {
          j(res.data);
        } else {
          r(res.data);
        }
      }), _defineProperty(_wx$request, "fail", function fail(e) {
        j(self.handlerError.apply(self, arguments));
      }), _wx$request));
    });
  },
  post: function post(options, isDebug) {
    var cpOpt = Object.assign({}, options),
        self = this;
    cpOpt.data = cpOpt.data || {};
    if (!cpOpt.noUid && !cpOpt.data.uid) cpOpt.data.uid = options.uid || '';

    if (!cpOpt.type) {
      cpOpt.type = 'json';
    }

    if (!(cpOpt.url.indexOf('http') === 0)) {
      cpOpt.url = config.serverBaseUrl + cpOpt.url;
    }

    return new Promise(function (r, j) {
      var _wx$request2;

      wx.request((_wx$request2 = {
        url: cpOpt.url,
        //仅为示例，并非真实的接口地址
        data: options.data,
        header: cpOpt.headers,
        method: 'POST',
        timeout: timeout
      }, _defineProperty(_wx$request2, "data", options.data), _defineProperty(_wx$request2, "success", function success(res) {
        if (res.data.errorNo || res.data.code) {
          j(res.data);
        } else {
          r(res.data);
        }
      }), _defineProperty(_wx$request2, "fail", function fail(e) {
        j(self.handlerError.apply(self, arguments));
      }), _wx$request2));
    });
  }
};

var _default = new AjaxService();

exports["default"] = _default;