var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"), // Extract text from bundle into a file
    HtmlWebpackPlugin = require('html-webpack-plugin')

var __config = require('./config/index.js')

var webpackConfig = require('./webpack.base.js')


if(!__config.PUBLIC_PATH || __config.PUBLIC_PATH == './'){
    webpackConfig.output.PUBLIC_PATH = '../'
}else{
    webpackConfig.output.PUBLIC_PATH = __config.PUBLIC_PATH
}

webpackConfig.module.loaders.push({
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract('style-loader', ['css-loader?minimize','postcss-loader','sass-loader'])
})

webpackConfig.module.loaders.push({
    test: /\.css$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract('style-loader', ['css-loader?minimize'])
})

//项目目录
var _HtmlPluginOptions = {
    title:__config.TITLE,
    DESIGN_WIDTH:__config.DESIGN_WIDTH,
    RESPONSIVE_REM: __config.RESPONSIVE_REM,
    RESPONSIVE_ZOOM:__config.RESPONSIVE_ZOOM,
    ISCSS_INTERNAL: __config.CSS_INTERNAL,
    PUBLIC_PATH: __config.PUBLIC_PATH || './',
    ASSETS: {
        "js" : "js/bundle.js",
        "css"  : "css/app.css",
    },
    inject: false,
    template: path.resolve('./src/common/template/index.ejs')
}
webpackConfig.entry[__config.PROJECTPATH] = './src/' + __config.PROJECTPATH + '/js/entry.js';
_HtmlPluginOptions.templatePath = __config.PROJECTPATH
webpackConfig.plugins.push(new HtmlWebpackPlugin(_HtmlPluginOptions));

//css 外链方式
webpackConfig.plugins.push(new ExtractTextPlugin("css/app.css", {
    allChunks: true
}))

// 代码丑化
webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}))

// 图片压缩
webpackConfig.imageWebpackLoader = __config.PUBLISH_IMAGEMIN || {progressive:true}

module.exports = webpackConfig;
