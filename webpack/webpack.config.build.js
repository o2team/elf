const path = require('path')
const _ = require('lodash')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const merge = require('webpack-merge')

const allConfig = require('../config/index.js')
const baseWebpackConfig = require('./webpack.base.js')

const config = _.merge(allConfig, allConfig.PRODUCTION)

const cssExtractQuery = {
  publicPath: config.outputCssPublicPath || config.output.publicPath
}

let imageLoaders = ['url-loader?' + JSON.stringify(config.imgLoaderQuery)]
let imageToBase64Loaders = ['url-loader?limit=10000000']
config.enableImageMin && imageLoaders.push('image-webpack')
config.enableImageMin && imageToBase64Loaders.push('image-webpack')

module.exports = merge(baseWebpackConfig, {
  entry: config.entry,
  module: {
    loaders: [{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: [/node_modules/].concat(config.imgToBase64Dir),
      loaders: imageLoaders
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: /node_modules/,
      include: config.imgToBase64Dir,
      loaders: imageToBase64Loaders
    }, {
      test: /\.css$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader'], cssExtractQuery)
    }, {
      test: /\.scss$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'], cssExtractQuery)
    }, {
      test: /\.less$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'less-loader'], cssExtractQuery)
    }, {
      test: /\.styl$/,
      // exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'stylus-loader'], cssExtractQuery)
    }]
  },
  plugins: [
    new ExtractTextPlugin(config.outputCss, {
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
