"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

(function (window) {
  function UrlTool() {}

  UrlTool.prototype = {
    gotoHrefWithParam: function gotoHrefWithParam(url, params, isReplace) {
      var newUrl = this.getHrefWithParam(url, params);

      if (isReplace) {
        window.location.replace(newUrl);
      } else {
        location.href = newUrl;
      }
    },
    getHrefWithParam: function getHrefWithParam(url, params) {
      !params && (params = {});
      var nowParams = this.getRequestParams(location.href);
      Object.assign(nowParams, params);
      var newUrl = this.getUrlByParamsObj(url, nowParams);
      return newUrl;
    },
    getRequestParams: function getRequestParams(ul) {
      if (ul.indexOf('?') > -1) {
        var search = decodeURI(ul).split('?')[1]; //获取url中"?"符后的字串

        var theRequest = {};
        var strs = search.split("&");

        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }

        return theRequest;
      } else {
        return {};
      }
    },
    isParamOk: function isParamOk(key, url) {
      var value = this.getParamValue(key, url);
      return this.isStringOk(value);
    },
    isStringOk: function isStringOk(value) {
      return value && value !== '' && value !== 'null' && value !== 'undefined';
    },
    addParam: function addParam(key, value, url) {
      var theUrl = url || window.location.href;
      var hash = '';

      if (theUrl.indexOf('#') > -1) {
        var splitArray = theUrl.split('#');
        theUrl = splitArray[0];
        hash = splitArray[1];
      }

      if (theUrl.indexOf('?') > -1) {
        theUrl = theUrl + '&' + key + '=' + value;
      } else {
        theUrl = theUrl + '?' + key + '=' + value;
      }

      hash && (theUrl = theUrl + '#' + hash);
      return theUrl;
    },
    removeParam: function removeParam(key, url) {
      var theUrl = url || window.location.href;
      var reg = new RegExp('([\&\?]' + key + '=[^&]*)', 'i');
      return theUrl.replace(reg, '');
    },
    changeParam: function changeParam(key, value, url) {
      var theUrl = url || window.location.href;
      var reg = new RegExp('(' + key + '=[^&]*)', 'i');
      theUrl = theUrl.replace(reg, key + '=' + value);
      return theUrl;
    },
    getUrlByParamsObj: function getUrlByParamsObj(url, obj) {
      var theUrl = url,
          key;

      for (key in obj) {
        theUrl = this.addParam(key, obj[key], theUrl);
      }

      theUrl = this.addParam('v', '1.0.1', theUrl);
      return theUrl;
    },
    getSearch: function getSearch(url) {
      if (url && url.indexOf('?') > -1) {
        return '?' + url.split('?')[1];
      } else if (url) {
        return '?noparam=noparam';
      } else {
        return null;
      }
    },
    getParamValue: function getParamValue(key, url) {
      var params = this.getRequestParams(this.getSearch(url) || window.location.search);
      return this.isStringOk(params[key]) && params[key];
    },
    hasParamKey: function hasParamKey(key, url) {
      return this.getParamValue(key, url) !== undefined;
    }
  };
  window.urlTool = new UrlTool();
})(global);

var _default = global.urlTool;
exports["default"] = _default;