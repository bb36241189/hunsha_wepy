/**
 * Created by Administrator on 2019/5/23 0023.
 */
// 各种浏览器兼容 from:http://www.webhek.com/post/page-visibility.html

const Pubsub = require('./Pubsub');

;(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define('VisibleUtil',[],function(){
            return factory(root);
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = factory(root);
    } else {
        root.PubSub = factory(root);
    }
}(this, function(global) {
    function VisibleUtil(){
        Pubsub.call(this);
        var hidden, state, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
            state = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
            state = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
            state = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
            state = "webkitVisibilityState";
        }
        this.hidden = hidden;
        this.state = state;
        this.visibilityChange = visibilityChange;
    }
    VisibleUtil.prototype = Object.create(Pubsub.prototype);
    VisibleUtil.prototype.onChange = function(callback) {
        document.addEventListener(this.visibilityChange, function() {
            var tag = document.hidden || document.webkitHidden;
            callback && callback(!tag);
        }, false);
    }
    return new VisibleUtil();
}))
