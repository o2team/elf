const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const _ = require('lodash')
const { isExist } = require('./utils.js')
const { CONFIG_FILENAME } = require('../config/const.js')

const SYNC_FUNC_MAP = {
  'dir': syncDirOrFile,
  'file': syncDirOrFile,
  'json': syncJSON
}

function syncDirOrFile(assert, srcRootPath, destRootPath) {
  const srcPath = path.join(srcRootPath, assert.path)
  const destPath = path.join(destRootPath, assert.path)

  if (
    (assert.type === 'file' && !isExist(destPath, assert.type)) ||
    (assert.type === 'dir' && !isExist(destPath, assert.type)) ||
    assert.action === 'force'
  ) {
    console.log('    ' + chalk.cyan(assert.path))

    fs.copySync(srcPath, destPath)
  }
}

function syncJSON(assert, srcRootPath, destRootPath) {
  const srcPath = path.join(srcRootPath, assert.path)
  const destPath = path.join(destRootPath, assert.path)

  if (!isExist(destPath, 'file')) {
    console.log('    ' + chalk.cyan(assert.path))
    fs.copySync(srcPath, destPath)
  } else if (assert.action === 'assignFields' && assert.assignFields && assert.assignFields.length) {
    console.log(chalk.cyan('    assignFields [' + assert.assignFields + ']: ' + assert.path))

    const srcJSON = require(srcPath)
    let destJSON = require(destPath)

    assert.assignFields.forEach(field => {
      destJSON[field] = _.assign({}, destJSON[field], srcJSON[field])
    })

    fs.writeFile(destPath, JSON.stringify(destJSON, null, 2), 'utf-8')
  }
}

function sync(asserts, srcRootPath, destRootPath) {
  console.log('')
  console.log(chalk.cyan('  Begin generate project ...'))
  console.log('')

  fs.ensureDirSync(destRootPath)

  asserts.forEach(function (assert) {
    if (SYNC_FUNC_MAP[assert.type]) {
      SYNC_FUNC_MAP[assert.type](assert, srcRootPath, destRootPath)
    } else {
      console.error('No support type: ', assert)
    }
  })

  // copy config file
  fs.copySync(path.join(srcRootPath, '../../config/default.js'), path.join(destRootPath, CONFIG_FILENAME))
  console.log('    ' + chalk.cyan(CONFIG_FILENAME))

  console.log('')
  console.log(chalk.cyan('  End.'))
  console.log('')

}

module.exports = sync
