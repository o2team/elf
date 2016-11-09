var path = require('path'),
    webpack = require('webpack'),
    postcss = require('postcss'),
    autoprefixer = require('autoprefixer'), // add vendor prefixes to CSS rules
    sprites = require('postcss-sprites'), // generates spritesheets from your stylesheets
    postcssImport = require('postcss-import'), // inline @import rules content
    __config = require('./config/index.js'),
    __postcss_plugins = []

var ROOT = path.resolve('.')
var zeptoPath = path.join(ROOT, 'node_modules/zepto/dist/zepto.js')
var bodyHtmlPath = path.join(ROOT, 'src/body.html')
var baseConfig = {
    entry: {},
    output: {
        path: path.join(ROOT, __config.OUTPUT_PATH),
        PUBLIC_PATH: '/',
        filename: 'js/bundle.js'
    },
    module: {
        loaders: [{
            test: zeptoPath,
            loader: 'exports?window.$!script'
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
            exclude: /node_modules/,
            loaders: [
                'url-loader?limit=1&name=img/[name].[ext]',
                'image-webpack'
            ]
        }, {
            test: /\.(mp3)(\?\S*)?$/,
            exclude: /node_modules/,
            loader: 'url-loader?limit=100&name=plugin/[name].[ext]'
        }, {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'html-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            '__BODY_HTML__': JSON.stringify(bodyHtmlPath),
        }),
        new webpack.ProvidePlugin({
            $: zeptoPath,
            Zepto: zeptoPath,
            'window.Zepto': zeptoPath,
        })
    ],
    resolve: {
        extensions: ['', '.js', '.scss', 'css'],
        alias: {
            src: path.join(ROOT, 'src')
        }
    },
    externals: __config.EXTERNALS || {}
}

//postcss 配置
// sass，autoprefixer，postcssImport
__postcss_plugins = [autoprefixer, postcssImport({
    addDependencyTo: webpack
})]

// postcss sprite
var _spritesObj = {
    stylesheetPath: path.join(ROOT, 'src/css/'),
    spritePath: path.join(ROOT, 'src/img/'),
    retina: true,
    relativeTo: 'rule',
    spritesmith: {
        algorithm: 'left-right',
        padding: 1
    },
    groupBy: function (image) {
        var g = /img\/([a-z]+)\/[a-z A-Z _\- 1-9]+\.png/.exec(image.url)
        var g_name = g ? g[1] : g
        if (!g) {
            return Promise.reject()
        }
        return Promise.resolve(g_name)
    },
    filterBy: function (image) {
        if (!/img\/[a-z]+\/[a-z A-Z _\- 1-9]+\.png/.test(image.url)) {
            return Promise.reject()
        }
        return Promise.resolve()
    }
}

// 如果通过rem来做缩放配置雪碧图的rem
if (__config.RESPONSIVE_REM) {
    var updateRule = require('postcss-sprites/lib/core').updateRule

    _spritesObj.hooks = {
        onUpdateRule: function (rule, token, image) {
            // Use built-in logic for background-image & background-position
            updateRule(rule, token, image)

            rule.insertAfter(rule.last, postcss.decl({
                prop: 'background-size',
                value: image.spriteWidth / image.ratio + 'px ' + image.spriteHeight / image.ratio + 'px'
            }))

            rule.insertAfter(rule.last, postcss.decl({
                prop: 'background-repeat',
                value: 'no-repeat'
            }))

            // ['width', 'height'].forEach(function (prop) {
            //     rule.insertAfter(rule.last, postcss.decl({
            //         prop: prop,
            //         value: Math.round((image.coords[prop] + 1) / (__config.DESIGN_WIDTH / 20) * 100000) / 100000 + 'rem'
            //     }))
            // })
        }
    }
}
__postcss_plugins.push(sprites(_spritesObj))

if (__config.RESPONSIVE_REM) {
    var px2rem = require('postcss-plugin-px2rem')
    __postcss_plugins.push(px2rem({
        rootValue: __config.DESIGN_WIDTH / 20,
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

baseConfig.postcss = function () {
    return __postcss_plugins
}

module.exports = baseConfig
