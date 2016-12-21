const _ = require('lodash')
const webpack = require('webpack')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const sprites = require('postcss-sprites')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  resolveApp,
  resolveOwn
} = require('./resolve.js')
const {
  HeadJavascriptInjectPlugin
} = require('./plugins.js')
const allConfig = require('../config/index.js')
const ROOT = process.cwd()
const NODE_ENV = process.env.NODE_ENV || ''
const config = _.merge(allConfig, allConfig[NODE_ENV.toUpperCase()])

const zeptoPath = resolveOwn('../node_modules/zepto/dist/zepto.js')

const baseConfig = {
  output: {
    path: resolveApp(config.output.path),
    publicPath: config.output.publicPath,
    filename: config.output.filename
  },
  resolve: {
    extensions: ['', '.js', '.css', '.scss', '.less', '.styl'],
    alias: {
      src: resolveApp('src')
    }
  },
  resolveLoader: {
    // moduleTemplates: ['*-loader', '*'],
    root: resolveOwn('../node_modules')
  },
  module: {
    loaders: [{
      test: zeptoPath,
      loader: 'exports?window.$!script'
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: /node_modules/,
      loaders: [
        'url-loader?' + JSON.stringify(config.imgLoaderQuery),
        'image-webpack'
      ]
    }, {
      test: /\.(mp3)(\?\S*)?$/,
      exclude: /node_modules/,
      loader: 'url-loader?' + JSON.stringify(config.audioLoaderQuery),
    }, {
      test: /\.html$/,
      exclude: /node_modules/,
      loader: 'html'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: zeptoPath,
      Zepto: zeptoPath,
      'window.Zepto': zeptoPath
    }),
    new HtmlWebpackPlugin({
      template: resolveApp(config.htmlWebpackPluginOptions.template)
    }),
    // new webpack.DefinePlugin({}),
    new HeadJavascriptInjectPlugin()
  ],
  externals: config.externals || {}
}

/*********** postcss plugin ***********/
let __postcss_plugins = []

// autoprefixer
__postcss_plugins = [autoprefixer(config.autoprefixerOptions)]

// sprite
let _spritesObj = {
  stylesheetPath: resolveApp('src/css/'),
  spritePath: resolveApp('src/img/'),
  retina: true,
  relativeTo: 'rule',
  spritesmith: {
    algorithm: 'left-right',
    padding: 1
  },
  groupBy: function (image) {
    let g = /img\/([a-z]+)\/[a-z A-Z _\- 1-9]+\.png/.exec(image.url)
    let g_name = g ? g[1] : g
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
if (config.enableREM) {
  const updateRule = require('postcss-sprites/lib/core').updateRule

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
      //         value: Math.round((image.coords[prop] + 1) / (config.designLayoutWidth / 20) * 100000) / 100000 + 'rem'
      //     }))
      // })
    }
  }
}
__postcss_plugins.push(sprites(_spritesObj))

if (config.enableREM) {
  const px2rem = require('postcss-plugin-px2rem')
  __postcss_plugins.push(px2rem(_.assign(config.px2remOptions, {
    rootValue: config.designLayoutWidth / config.baseSize,
  })))
}

baseConfig.postcss = function () {
  return __postcss_plugins
}

module.exports = baseConfig
