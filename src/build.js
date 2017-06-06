process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const util = require('util')
const chalk = require('chalk')
const _ = require('lodash')
const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const webpackConfig = require('../webpack/webpack.config.build.js')

const buildPath = webpackConfig.output.path

const debug = process.argv[2]

clearConsole()

if (debug) {
  let value = ''
  if (debug === '.') {
    value = webpackConfig
  } else {
    value = _.get(webpackConfig, debug)
  }

  console.log('')
  console.log(
    chalk.yellow('[DEBUG] ') +
    'webpack config   KEY: ' +
    chalk.yellow(debug)
  )
  console.log(
    chalk.yellow('[DEBUG] ') +
    'webpack config VALUE: ' +
    chalk.yellow(util.inspect(value, {
      depth: null
    }))
  )
  console.log()
}
console.log('')
console.log(chalk.cyan('  Prepare build ...'))
console.log('')
console.log(chalk.cyan('  Empty directory: ') + chalk.cyan.inverse(buildPath))
fs.emptyDirSync(buildPath)

console.log('')
console.log(chalk.cyan('  Begin build ...'))
console.log('')

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')

  console.log('')
  console.log(chalk.cyan('  Build finished.'))
  console.log('')
})
