/**
 * Created by Administrator on 2018/4/9 0009.
 */
var IScroll = require('./iscroll-probe');
var iscrollInteractiveHandler = require('./iscrollInteractiveHandler');
var pressbtnHandler = new iscrollInteractiveHandler.pressbtnHandler();
pressbtnHandler.doHandler();
module.exports = IScroll;
