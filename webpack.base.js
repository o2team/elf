var path = require('path'),
    webpack = require('webpack'),
    postcss = require('postcss'), 
    autoprefixer = require('autoprefixer'), // add vendor prefixes to CSS rules
    sprites = require('postcss-sprites'), // generates spritesheets from your stylesheets
    postcssImport = require('postcss-import'), // inline @import rules content
    __Config = require('./config/index.js'),
    __postcss_plugins = []


var baseConfig = {
    entry: {
        //'bundle':path.resolve('./src/js/entry.js')
    },
    output: {
        path: path.resolve(__Config.OUTPUT_PATH),
        publicPath: '/',
        filename: 'js/bundle.js'
    },
    module: {
        loaders: [{
            test: require.resolve('./src/common/js/lib/zepto.js'),
            exclude: /node_modules/,
            loader: 'exports?window.$!script'
        },{
            test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
            exclude: /node_modules/,
            loaders: [
                'url-loader?limit=1&name=img/[name].[ext]',
                'image-webpack'
            ]
        },{
            test: /\.(mp3)(\?\S*)?$/,
            exclude: /node_modules/,
            loader: 'url-loader?limit=100&name=plugin/[name].[ext]'
        },
        {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: "html-loader"
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "zepto",
            Zepto: 'zepto',
            'window.Zepto': 'zepto'
        })
    ],
    resolve: {
        alias : {
            "zepto": path.resolve('./src/common/js/lib/zepto.js')
        }
    },
    externals: __Config.EXTERNALS || {}
}
//postcss 配置
// sass，autoprefixer，postcssImport
__postcss_plugins = [autoprefixer, postcssImport({
    addDependencyTo: webpack
})]

// postcss sprite
var _spritesObj = {
    stylesheetPath: path.resolve('./src/' + __Config.PROJECTPATH + '/css/'),
    spritePath:  path.resolve('./src/' + __Config.PROJECTPATH + '/img/'),
    retina:true,
    relativeTo: 'rule',
    spritesmith:{
        algorithm:'left-right',
        padding:1
    },
    groupBy: function(image) {
        var g = /img\/([a-z]+)\/[a-z A-Z _\- 1-9]+\.png/.exec(image.url)
        var g_name = g ? g[1] : g
        if(!g){
            return Promise.reject();
        }
        return Promise.resolve(g_name);
    },
    filterBy: function(image){
        if(!/img\/[a-z]+\/[a-z A-Z _\- 1-9]+\.png/.test(image.url)){
            return Promise.reject();
        }
        return Promise.resolve();
    }
}

// 如果通过rem来做缩放配置雪碧图的rem
if(__Config.RESPONSIVE_REM){
    var updateRule = require('postcss-sprites/lib/core').updateRule

    _spritesObj.hooks = {
        onUpdateRule: function(rule, token, image) {
            // Use built-in logic for background-image & background-position
            updateRule(rule, token, image);
            
            rule.insertAfter(rule.last, postcss.decl({
                prop: 'background-size',
                value: image.spriteWidth / image.ratio + 'px ' + image.spriteHeight / image.ratio + 'px'
            }));

            rule.insertAfter(rule.last, postcss.decl({
                prop: 'background-repeat',
                value: 'no-repeat'
            }));

            ['width', 'height'].forEach(function(prop) {
                rule.insertAfter(rule.last, postcss.decl({
                    prop: prop,
                    value: Math.round((image.coords[prop] + 1) / (__Config.DESIGN_WIDTH / 20) * 100000) / 100000 + 'rem'
                }));
            });
        }
    }
}
__postcss_plugins.push(sprites(_spritesObj))

if(__Config.RESPONSIVE_REM){
    var px2rem = require('postcss-plugin-px2rem')
    __postcss_plugins.push(px2rem({
        rootValue: __Config.DESIGN_WIDTH / 20, 
        unitPrecision: 5,
        propWhiteList: [],
        propBlackList: [],
        selectorBlackList: ['ignore'],
        ignoreIdentifier: false,
        replace: true,
        mediaQuery: false,
        minPixelValue: 0
    }))
}

baseConfig.postcss = function(){
    return __postcss_plugins || []
}

module.exports = baseConfig
