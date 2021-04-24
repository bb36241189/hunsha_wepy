/**
 * Created by Administrator on 2018/4/25 0025.
 */
const Pubsub = require('./Pubsub');
const Promise = require('promise');
function WebSocketConnect(url){
  var self = this;
  Pubsub.call(this);
  this.readed = false;
  this.ws = null;//WebSocket对象
  if(this.checkSupport()){
    this.openConnect(url).then(function () {
      self.trigger('ready');
      self.readed = true;
    });
    this._onmessage();
    this._onclose();
  }else{
    alert('不支持websocket');
  }
}
WebSocketConnect.prototype = Object.create(Pubsub.prototype);
Object.assign(WebSocketConnect.prototype,{
  constructor : WebSocketConnect,
  ready : function () {
    var self = this;
    if(this.readed){
      return Promise.resolve(this.ws);
    }else{
      return new Promise(function (r,j) {
        self.on('ready',function () {
          r(self.ws);
        })
      })
    }
  },
  checkSupport : function () {
    return "WebSocket" in window;
  },
  openConnect : function (url) {
    var self = this;
    // this.ws = new WebSocket("ws://localhost:3001/upgrade");
    this.ws = new WebSocket(url);
    return new Promise(function (r,j) {
      self.ws.onopen = function(e){
        r(e);
      };
    });
  },
  _onmessage : function () {
    var self = this;
    this.ws.onmessage = function (evt){
      var received_msg = evt.data,retObj = null;
      eval("retObj="+received_msg);
      self.trigger('message',retObj);
    };
  },
  _onclose : function () {
    var self = this;
    this.ws.onclose = function(e){
      self.trigger('close',e);
    };
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
  sendData : function (Obj) {
    // this.ws.send(JSON.stringify({
    //   type : 'test',
    //   key : 'talk',
    //   value : input.value
    // }))
    !Obj.id && (Obj.id = this._guid());
    var self = this;
    return new Promise(function (r,j) {
      self.ws.send(JSON.stringify(Obj));
      self.on('message',function (ret) {
        if(ret.id === Obj.id){
          r(ret);
        }
      })
    });
  }
});
module.exports = WebSocketConnect;
