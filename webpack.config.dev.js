var path = require('path'),
    //ExtractTextPlugin = require("extract-text-webpack-plugin"), // Extract text from bundle into a file
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

var __Config = require('./config/index.js')

var webpackConfig = require('./webpack.base.js')

webpackConfig.module.loaders.push({
    test: /\.scss$/,
    exclude: /node_modules/,
    loaders: ['style', 'css', 'postcss','sass']
})

webpackConfig.module.loaders.push({
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style', 'css']
})

//项目目录
var _HtmlPluginOptions = {
    title:__Config.TITLE || 'O2H5_Boilerplate',
    DESIGN_WIDTH:__Config.DESIGN_WIDTH,
    RESPONSIVE_REM: __Config.RESPONSIVE_REM,
    RESPONSIVE_ZOOM:__Config.RESPONSIVE_ZOOM,
    ISCSSINTERNAL: __Config.CSSINTERNAL,
    publicPath: __Config.PUBLICPATH || '/',
    ASSETS: {
        "js" : "js/bundle.js",
        "css"  : false,
    },
    inject: false,
    template: path.resolve('./src/common/template/index.ejs')
}
webpackConfig.entry[__Config.PROJECTPATH] = './src/' + __Config.PROJECTPATH + '/js/entry.js';
_HtmlPluginOptions.templatePath = __Config.PROJECTPATH
webpackConfig.plugins.push(new HtmlWebpackPlugin(_HtmlPluginOptions));


// 辨已完成后打开浏览器
webpackConfig.plugins.push(new OpenBrowserPlugin({ url: 'http://' + (__Config.IP || 'localhost') + ':' + __Config.PORT }))

/**
 * 本地服务器
 */
webpackConfig.devServer = {
    port: __Config.PORT,
    hot: true,
    inline: true,
    contentBase: './' + __Config.OUTPUT_PATH
}


module.exports = webpackConfig;