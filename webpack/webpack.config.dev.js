const path = require('path')
const _ = require('lodash')
const merge = require('webpack-merge')
const webpack = require('webpack')

const allConfig = require('../config/index.js')
const baseWebpackConfig = require('./webpack.base.js')

const config = _.merge(allConfig, allConfig.DEVELOPMENT)

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-source-map',
  entry: [].concat([
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
  ], config.entry),
  module: {
    loaders: [{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: [/node_modules/].concat(config.imgToBase64Dir),
      loaders: [
        'url-loader?' + JSON.stringify(config.imgLoaderQuery)
      ]
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: /node_modules/,
      include: config.imgToBase64Dir,
      loaders: [
        'url-loader?limit=10000000'
      ]
    }, {
      test: /\.css$/,
      // exclude: /node_modules/,
      loaders: ['style', 'css', 'postcss']
    }, {
      test: /\.scss$/,
      // exclude: /node_modules/,
      loaders: ['style', 'css', 'postcss', 'sass']
    }, {
      test: /\.less$/,
      // exclude: /node_modules/,
      loaders: ['style', 'css', 'postcss', 'less']
    }, {
      test: /\.styl$/,
      // exclude: /node_modules/,
      loaders: ['style', 'css', 'postcss', 'stylus']
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: config.devPort,
    // host: '0.0.0.0',
    // contentBase: '',
    // publicPath: config.output.publicPath,
    publicPath: '/', // 开发模式固定用 /
    hot: true,
    inline: true,
    quiet: true,
    // compress: true,
    // clientLogLevel: 'none',
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    }
  }
})
