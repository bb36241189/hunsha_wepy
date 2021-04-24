/**
 * Created by Administrator on 2017/11/27 0027.
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function Ticker(frameRate){
    this.lastTime = 0;
    this.frameDuration = 1000 / frameRate;
    this.timer = null;
    PubSub.call(this);
}
Ticker.prototype = Object.create(PubSub.prototype);
Ticker.prototype.constructor = Ticker;
Ticker.prototype.start = function(){
    var self = this;
    this.lastTime = Date.now();
    this.timer = requestAnimationFrame(function tick(){
        var now = Date.now();
        self.timer = requestAnimationFrame(tick);
        if(now-self.lastTime>=self.frameDuration) {self.trigger('tick'); self.lastTime = now;}
    })
};
Ticker.prototype.stop = function(){
    cancelAnimationFrame(this.timer);
};
Ticker.prototype.nextTick = function (callback) {
    requestAnimationFrame(callback);
    return this;
};

export default Ticker;