var path = require('path'),
    //ExtractTextPlugin = require("extract-text-webpack-plugin"), // Extract text from bundle into a file
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

var __config = require('./config/index.js')
var webpackConfig = require('./webpack.base.js')
var ROOT = path.resolve('.')

webpackConfig.module.loaders.push({
    test: /\.scss$/,
    exclude: /node_modules/,
    loaders: ['style', 'css', 'postcss', 'sass']
})

webpackConfig.module.loaders.push({
    test: /\.css$/,
    exclude: /node_modules/,
    loaders: ['style', 'css']
})

//项目目录
var _HtmlPluginOptions = {
    title: __config.TITLE,
    DESIGN_WIDTH: __config.DESIGN_WIDTH,
    RESPONSIVE_REM: __config.RESPONSIVE_REM,
    RESPONSIVE_ZOOM: __config.RESPONSIVE_ZOOM,
    IS_CSS_INTERNAL: !!__config.CSS_INTERNAL,
    PUBLIC_PATH: __config.PUBLIC_PATH || '/',
    ASSETS: {
        "js": "js/bundle.js",
        "css": false,
    },
    inject: false,
    template: path.join(ROOT, 'src/index.template.ejs')
}
webpackConfig.entry = path.join(ROOT, 'src/js/main.js')
webpackConfig.plugins.push(new HtmlWebpackPlugin(_HtmlPluginOptions));

// 辨已完成后打开浏览器
// webpackConfig.plugins.push(new OpenBrowserPlugin({
//     url: 'http://' + (__config.IP || 'localhost') + ':' + __config.PORT
// }))

/**
 * 本地服务器
 */
webpackConfig.devServer = {
    port: __config.PORT,
    hot: true,
    inline: true,
    contentBase: './' + __config.OUTPUT_PATH
}


module.exports = webpackConfig;
