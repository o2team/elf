const path = require('path')
const _ = require('lodash')
const merge = require('webpack-merge')
const webpack = require('webpack')
var autoprefixer = require('autoprefixer')

const allConfig = require('../config/index.js')
const baseWebpackConfig = require('./webpack.base.js')
const postcssPlugins = require('./postcss.config.js')

const config = _.merge({}, allConfig, allConfig.DEVELOPMENT)

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-source-map',
  entry: [].concat([
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
  ], config.entry),
  module: {
    rules: [{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: [/node_modules/].concat(config.imgToBase64Dir),
      use: [{
        loader: 'url-loader',
        options: config.imgLoaderQuery
      }]
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: /node_modules/,
      include: config.imgToBase64Dir,
      use: [{
        loader: 'url-loader',
        options: {
          limit: '10000000'
        }
      }]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: postcssPlugins
        }
      }]
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: postcssPlugins
        }
      }, 'sass-loader']
    }, {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: postcssPlugins
        }
      }, 'less-loader']
    }, {
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: postcssPlugins
        }
      }, 'stylus-loader']
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
