const path = require('path')
const _ = require('lodash')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const merge = require('webpack-merge')

const allConfig = require('../config/index.js')
const baseWebpackConfig = require('./webpack.base.js')
const postcssPlugins = require('./postcss.config.js')

const config = _.merge({}, allConfig, allConfig.PRODUCTION)

let imageLoaders = [{
  loader: 'url-loader',
  options: config.imgLoaderQuery
}]
let imageToBase64Loaders = [{
  loader: 'url-loader',
  options: {
    limit: '10000000'
  }
}]
let imageWebpackLoader = {
  loader: 'image-webpack-loader',
  options: config.imageWebpackLoader
}

config.enableImageMin && imageLoaders.push(imageWebpackLoader)
config.enableImageMin && imageToBase64Loaders.push(imageWebpackLoader)

module.exports = merge(baseWebpackConfig, {
  entry: config.entry,
  module: {
    rules: [{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: [/node_modules/].concat(config.imgToBase64Dir),
      use: imageLoaders
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: /node_modules/,
      include: config.imgToBase64Dir,
      use: imageToBase64Loaders
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: postcssPlugins
          }
        }],
        publicPath: config.outputCssPublicPath || config.output.publicPath
      })
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: postcssPlugins
          }
        }, 'sass-loader'],
        publicPath: config.outputCssPublicPath || config.output.publicPath
      })
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: postcssPlugins
          }
        }, 'less-loader'],
        publicPath: config.outputCssPublicPath || config.output.publicPath
      })
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: postcssPlugins
          }
        }, 'stylus-loader'],
        publicPath: config.outputCssPublicPath || config.output.publicPath
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: config.outputCss,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(config.uglifyjsPluginOptions),
    new webpack.LoaderOptionsPlugin({
      // options: {
      //   context: __dirname
      // },
      minimize: true
    })
  ]
})
