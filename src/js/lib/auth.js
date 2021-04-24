/**
 * Created by Administrator on 2018/5/16 0016.
 */
const urlTool = require('./urlTool');
const pinkJsBridge = require('./pinkJsBridge');
const commonUtil = require('../commonUtil');
function Auth() {
  this.isTest = true;
  this.auth_param = null;
  this.weixin_auth = 'https://open.weixin.qq.com/connect/oauth2/authorize?state='+(this.isTest?'bc-bargain-test':'bc-bargain')+'&appid=wxede9a654ad6a9cc7&response_type=code&scope=snsapi_userinfo&redirect_uri=http%3A%2F%2Fshop-app.mall.fenfenriji.com%2Fwx%2Fcallback.php'
  this.weibo_auth = 'http://shop-app.mall.fenfenriji.com/weibo/index.php?state='+(this.isTest?'bc-bargain-test':'bc-bargain');
  this.qq_auth = 'http://shop-app.mall.fenfenriji.com/qq/oauth/index.php?state='+(this.isTest?'bc-bargain-test':'bc-bargain');
}
Auth.prototype = {
  constructor : Auth,
  judgeIsAuthed : function (){
    if(this.auth_param){
      return Promise.resolve(true);
    }else{
      // return Promise.reject();
      return this.getLocalValue('auth_param').then(function (ret) {
        if(ret){
          return Promise.resolve(true);
        }else{
          return Promise.reject();
        }
      });
    }
  },
  getLocalValue : function (key) {
    return pinkJsBridge.getLocalStorage(key);
  },
  getAuthParam : function (){
    if(this.auth_param){
      return this.auth_param;
    }else{
      if(wx.getStorageSync('auth_param')){
        var auth_param = JSON.parse(wx.getStorageSync('auth_param'));
        return auth_param;
      }else{
        return null;
      }
    }
  },
  doAuth : function (){
    var self = this;
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    this.judgeIsAuthed().then(function (ret) {

    }).catch(function (e) {
      if(urlTool.isParamOk('openid')){
        var param = urlTool.getRequestParams(window.location.href);
        self.auth_param = param;
        commonUtil.reLoginUid = wx.getStorageSync('from-bc-uid');
        wx.setStorageSync('auth_param',JSON.stringify(param));
      }else{
        wx.setStorageSync('from-bc-uid',urlTool.getParamValue('uid'));
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          window.location.href = self.weixin_auth;
        }else if (ua.match(/WeiBo/i) == "weibo") {
          //在新浪微博客户端打开
          window.location.href = self.weibo_auth;
        }else if (ua.match(/QQ/i) == "qq") {
          //在QQ空间打开
          window.location.href = self.qq_auth;
        }
      }
    });
  }
};
module.exports = new Auth();
