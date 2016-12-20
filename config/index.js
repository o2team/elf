const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const _ = require('lodash')
const { isExist } = require('../src/utils.js')
const defaultConfig = require('./default.js')
const { CONFIG_FILENAME } = require('./const.js')
let config = {}

// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}
function resolveOwn(relativePath) {
  return path.resolve(__dirname, relativePath);
}

const configPath = resolveApp(CONFIG_FILENAME)
try {
  if (isExist(configPath, 'file')) {
    config = require(configPath)
  }
} catch (err) {
  console.log('')
  console.log('Load config file: ' + chalk.cyan(configPath) + ' occur error!')
  console.log('')
  console.error(err)
  process.exit(1)
}

module.exports = _.merge(defaultConfig, config)
