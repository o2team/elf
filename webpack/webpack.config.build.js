const path = require('path')
const _ = require('lodash')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const merge = require('webpack-merge')

const allConfig = require('../config/default.js')
const baseWebpackConfig = require('./webpack.base.js')

const ROOT = process.cwd()
const config = _.merge({}, allConfig, allConfig.PRODUCTION)

module.exports = merge(baseWebpackConfig, {
  entry: config.entry,
  module: {
    loaders: [{
      test: /\.css$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader'])
    }, {
      test: /\.scss$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'])
    }, {
      test: /\.less$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'less-loader'])
    }, {
      test: /\.styl$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'stylus-loader'])
    }]
  },
  plugins: [
    new ExtractTextPlugin("css/app.css", {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  imageWebpackLoader: config.imageWebpackLoader
})
