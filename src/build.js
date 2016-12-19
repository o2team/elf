process.env.NODE_ENV = 'production'

const fs = require('fs-extra')
const chalk = require('chalk')
const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const webpackConfig = require('../webpack/webpack.config.build.js')

const buildPath = webpackConfig.output.path

clearConsole()
console.log('')
console.log(chalk.cyan('  Prepare build ...'))
console.log('')
console.log(chalk.cyan('  Empty directory: ') + chalk.cyan.inverse(buildPath))
fs.removeSync(buildPath)
fs.mkdirsSync(buildPath)

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
