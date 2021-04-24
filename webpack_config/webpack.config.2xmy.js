/**
 * Created by Administrator on 2017/5/2 0002.
 */
const MyPlugin = require('./webpack.toxmy')
const basic = require('./webpack.config.basic');
basic.plugins.push(new MyPlugin());
module.exports = basic;