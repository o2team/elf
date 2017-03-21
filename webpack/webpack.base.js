const _ = require('lodash')
const webpack = require('webpack')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const sprites = require('postcss-sprites')
const assets = require('postcss-assets')
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
const config = _.merge({}, allConfig, allConfig[NODE_ENV.toUpperCase()])

const zeptoPath = require.resolve('zepto')

const baseConfig = {
  output: _.merge({}, config.output, {
    path: resolveApp(config.output.path)
  }),
  resolve: {
    extensions: ['', '.js', '.css', '.scss', '.less', '.styl'],
    alias: {
      src: resolveApp('src')
    }
  },
  resolveLoader: {
    // moduleTemplates: ['*-loader', '*'],
    root: resolveOwn('node_modules')
  },
  module: {
    loaders: [{
      test: zeptoPath,
      loader: 'exports?window.$!script'
    }, {
      test: /\.(mp3|mp4|webm|mov|ogg|ogv)(\?\S*)?$/,
      exclude: /node_modules/,
      loader: 'file-loader?' + JSON.stringify(config.audioLoaderQuery),
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
    new HtmlWebpackPlugin(config.htmlWebpackPluginOptions),
    // new webpack.DefinePlugin({}),
    new HeadJavascriptInjectPlugin()
  ],
  externals: config.externals || {}
}

/*********** postcss plugin ***********/
let postcssPlugins = []

// assets
postcssPlugins.push(assets(config.assetsOptions))

// sprites
let spritesOptions = config.spritesOptions

// 如果通过rem来做缩放配置雪碧图的rem
if (config.enableREM) {
  const updateRule = require('postcss-sprites/lib/core').updateRule

  spritesOptions.hooks = {
    onUpdateRule: function (rule, token, image) {
      updateRule(rule, token, image)

      rule.insertAfter(rule.last, postcss.decl({
        prop: 'background-size',
        value: image.spriteWidth / image.ratio + 'px ' + image.spriteHeight / image.ratio + 'px;'
      }))
    }
  }
}
if (config.enableSpritesOnDev || NODE_ENV === 'production') {
  postcssPlugins.push(sprites(spritesOptions))
}

if (config.enableREM) {
  const px2rem = require('postcss-plugin-px2rem')
  postcssPlugins.push(px2rem(_.assign(config.px2remOptions, {
    rootValue: config.designLayoutWidth / config.baseSize,
  })))
}

// autoprefixer
postcssPlugins.push(autoprefixer(config.autoprefixerOptions))

baseConfig.postcss = function () {
  return postcssPlugins
}

module.exports = baseConfig
