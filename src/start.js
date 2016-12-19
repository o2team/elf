process.env.NODE_ENV = 'development'

const chalk = require('chalk')
const ip = require('ip')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const openBrowser = require('react-dev-utils/openBrowser')

const webpackConfig = require('../webpack/webpack.config.dev.js')
const isInteractive = process.stdout.isTTY

let isFirstRun = true

function setupCompiler(host, port) {
  compiler = webpack(webpackConfig)

  compiler.plugin('invalid', function () {
    console.log('')
    console.log(chalk.cyan('  Compiling...'))
    console.log('')
  })

  compiler.plugin('done', function (stats) {
    process.stdout.write(stats.toString({
      colors: true,
      reasons: true,
      errorDetails: true,

      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')

    if (stats.hasErrors()) {
      console.log('')
      console.log(chalk.cyan('  Compiling fail!'))
      console.log('')
      return
    }

    if (isFirstRun) {
      console.log('')
      console.log(chalk.cyan('  Compile finished'))
      console.log('')
      console.log(chalk.cyan('  Webpack dev server running at: '))
      console.log('')
      console.log(chalk.cyan('  http://' + host + ':' + port + '/'))
      console.log('')
    }

    isFirstRun = false
  })
}

function runDevServer(host, port) {
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer)

  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err)
    }

    console.log(chalk.cyan('  Starting the development server...'))
    console.log()

    if (isInteractive) {
      openBrowser('http://' + host + ':' + port + '/')
    }
  })
}

function run(port) {
  const host = ip.address()
  setupCompiler(host, port)
  runDevServer(host, port)
}

clearConsole()
run(webpackConfig.devServer.port)
