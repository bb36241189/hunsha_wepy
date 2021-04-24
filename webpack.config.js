/**
 * Created by Administrator on 2017/5/2 0002.
 */
const webpack = require('webpack');
//当前项目的绝对路劲
const path = require('path');

// 命令行参数解析引擎
const argv = require('minimist')(process.argv.slice(2));

let env = null;

switch (argv.env) {
    case 'production':
        //生产环境配置文件名
        env = 'webpack.config.prod';
        break;
    case '2rem':
        env = 'webpack.config.2rem';
        break;
    case '2px':
        env = 'webpack.config.2px';
        break;
    case 'weex2wepy':
        env = 'webpack.config.weex2wepy';
        break;
    case '2rpx':
        env = 'webpack.config.2rpx';
        break;
    case 'xmy':
        env = 'webpack.config.2xmy';
        break;
    default:
        //开发环境配置文件名
        env = 'webpack.config.dev';

}

console.log(`当前是 ${argv.env} 打包`);

// 这时候，我们就可以加载相应的wabpack配置了。
module.exports = require( path.resolve( './webpack_config/',env ) );