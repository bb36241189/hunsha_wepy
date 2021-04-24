/**
 * Created by Administrator on 2018/1/30 0030.
 */
var config = require('../config');
// var ajax = require('../lib/ajax/ajax');
// import $ from '../lib/zepto';
const timeout = 30000;
function AjaxService() {

}
AjaxService.prototype = {
  constructor: AjaxService,
  /**
   * TODO
   */
  getLastServerTime: function () {
    return Date.now();
  },
  handlerError : function(xhr, errorType, error){
    if(xhr.responseText
      && xhr.responseText.indexOf('{') === 0
      && xhr.responseText.indexOf('}') === xhr.responseText.length - 1){
      return JSON.parse(xhr.responseText);
    }else if(xhr.responseText){
      return JSON.stringify({message : xhr.responseText});
    }else if(error){
      if(Object.prototype.toString.call(error) === "[object Object]"){
        return error;
      }else{
        return ({message : error});
      }
    }else if(errorType){
      if(errorType === 'abort'){
        return ({message : '请求中断'});
      }else{
        return ({message : errorType});
      }
      // return ({message : errorType});
    }else{
      return ({message : '未知异常'});
    }
  },
  get: function (options, isDebug){
    var self = this;
    isDebug && alert('get' + JSON.stringify(options));
    var cpOpt = Object.assign({}, options);
    cpOpt.data = cpOpt.data || {};
    if (!cpOpt.noUid && !cpOpt.data.uid)
      cpOpt.data.uid = options.uid || '';
    if (!cpOpt.type) {
      cpOpt.type = 'json';
    }
    if (!(cpOpt.url.indexOf('http') === 0)) {
      cpOpt.url = config.serverBaseUrl + cpOpt.url
    }
    return new Promise(function (r, j) {
      wx.request({
        url: cpOpt.url, //仅为示例，并非真实的接口地址
        data: options.data,
        header: cpOpt.headers,
        method: 'GET',
        timeout : timeout,
        data: options.data,
        success (res) {
          if(res.data.errorNo || res.data.code){
            j(res.data);
          }else{
            r(res.data)
          }
        },
        fail(e){
          j(self.handlerError.apply(self,arguments));
        }
      })
      
    })
  },
  post: function (options, isDebug) {
    var cpOpt = Object.assign({}, options),self = this;
    cpOpt.data = cpOpt.data || {};
    if (!cpOpt.noUid && !cpOpt.data.uid)
      cpOpt.data.uid = options.uid || '';
    if (!cpOpt.type) {
      cpOpt.type = 'json';
    }
    if (!(cpOpt.url.indexOf('http') === 0)) {
      cpOpt.url = config.serverBaseUrl + cpOpt.url
    }
    return new Promise(function (r, j) {
      wx.request({
        url: cpOpt.url, //仅为示例，并非真实的接口地址
        data: options.data,
        header: cpOpt.headers,
        method: 'POST',
        timeout : timeout,
        data: options.data,
        success (res) {
          if(res.data.errorNo || res.data.code){
            j(res.data);
          }else{
            r(res.data)
          }
        },
        fail(e){
          j(self.handlerError.apply(self,arguments));
        }
      })
    })
  }
};
export default new AjaxService();
