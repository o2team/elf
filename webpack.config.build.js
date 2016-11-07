var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"), // Extract text from bundle into a file
    HtmlWebpackPlugin = require('html-webpack-plugin')

var __Config = require('./config/index.js')

var webpackConfig = require('./webpack.base.js')


if(!__Config.PUBLICPATH || __Config.PUBLICPATH == './'){
    webpackConfig.output.publicPath = '../'
}else{
    webpackConfig.output.publicPath = __Config.PUBLICPATH 
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
    title:__Config.TITLE || 'O2H5_Boilerplate',
    DESIGN_WIDTH:__Config.DESIGN_WIDTH,
    RESPONSIVE_REM: __Config.RESPONSIVE_REM,
    RESPONSIVE_ZOOM:__Config.RESPONSIVE_ZOOM,
    ISCSSINTERNAL: __Config.CSSINTERNAL,
    publicPath: __Config.PUBLICPATH || './',
    ASSETS: {
        "js" : "js/bundle.js",
        "css"  : "css/app.css",
    },
    inject: false,
    template: path.resolve('./src/common/template/index.ejs')
}
webpackConfig.entry[__Config.PROJECTPATH] = './src/' + __Config.PROJECTPATH + '/js/entry.js';
_HtmlPluginOptions.templatePath = __Config.PROJECTPATH
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
webpackConfig.imageWebpackLoader = __Config.PUBLISH_IMAGEMIN || {progressive:true}

module.exports = webpackConfig;