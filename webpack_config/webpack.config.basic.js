/**
 * Created by Administrator on 2017/5/2 0002.
 */
const path = require('path');
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry : {
        app : path.resolve('./app.js'),
    },
    output : {
        path : path.resolve('./dist'),
        filename : '[name].[hash:8].js'
    },
    module : {
        rules : [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ]
    },
    plugins: []
}
