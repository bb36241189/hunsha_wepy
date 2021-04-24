/**
 * Created by Administrator on 2018/3/28 0028.
 */
// const pinkJsBridge = require('./lib/pinkJsBridge');
const urlTool = require('./lib/urlTool');
const config = require('./config');
function CommonUtil() {
  this.reLogin = false;
  this.reLoginUid = '';
  this.registeDateFormat();
}
CommonUtil.prototype = {
  constructor: CommonUtil,
  judgeLogin: function () {
    var self = this;
    return pinkJsBridge.getUserInfo().then(function (user) {
      console.log('judgeLogin true');
      return user;
    }).catch(function (e) {
      console.log('judgeLogin false');
      return pinkJsBridge.presentLogin().then(function (data) {
        self.reLogin = true;
        self.reLoginUid = data.uid;
        if(data.uid){
          return Promise.resolve(data);
        }else{
          return Promise.reject({message : '用户取消登录'});
        }
      }).catch(function (ee) {
        return ee || e;
      })
    })
  },
  _guid: function () {
      function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
  },
  registeDateFormat() {
      Date.prototype.Format = function (fmt) { //author: meizz
          var o = {
              "M+": this.getMonth() + 1, //月份
              "d+": this.getDate(), //日
              "h+": this.getHours(), //小时
              "m+": this.getMinutes(), //分
              "s+": this.getSeconds(), //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }
  },
  isInFenfen: function () {
    return pinkJsBridge.isInFenfen();
    // return urlTool.isParamOk('signature') && urlTool.getParamValue('signature') != '1';
  },
  gotoAppMarket: function () {
    window.location.href = 'https://android.myapp.com/myapp/detail.htm?apkName=pinkdiary.xiaoxiaotu.com&ADTAG=mobile';
  },
  isIphone: function () {
    var isIphone = false;
    var u = navigator.userAgent;
    if (u.indexOf('iPhone') > -1) {//苹果手机
      isIphone = true;
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
      isIphone = false;
    }
    return isIphone;
  },
  timeCountDown :  function(input,nowTime){
    var now = nowTime || Date.now();
    var spend = Number(input) - now;
    if(spend < 0){
      return null;
    }else{
      var second,minus,hours,day;
      day = Math.floor(spend/1000/60/60/24);
      hours = Math.floor((spend - day*24*60*60*1000)/1000/60/60);
      minus = Math.floor((spend - day*24*60*60*1000 - hours*60*60*1000)/1000/60);
      second = Math.floor((spend - day*24*60*60*1000 - hours*60*60*1000 - minus*60*1000)/1000);
      return day+'-'+hours+'-'+minus+'-'+second;
    }
  },
  /**
   * uid好的与否，兼容android和ios的差异
   * @returns {*|boolean}
   */
  isUidOk : function () {
    return this.reLogin || urlTool.isParamOk('uid') && Number(urlTool.getParamValue('uid')) !== 0
  },
  getUid : function () {
    return this.reLoginUid || urlTool.getParamValue('uid');
  }
};
export default new CommonUtil();
