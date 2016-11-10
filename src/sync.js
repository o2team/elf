const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const _ = require('lodash')

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
        log(`copy ${assert.type}`, srcPath, destPath)
        fs.copySync(srcPath, destPath)
    }
}

function syncJSON(assert, srcRootPath, destRootPath) {
    const srcPath = path.join(srcRootPath, assert.path)
    const destPath = path.join(destRootPath, assert.path)

    if (!isExist(destPath, 'file')) {
        log('copy json', srcPath, destPath)
        fs.copySync(srcPath, destPath)
    } else if (assert.action === 'assignFields' && assert.assignFields && assert.assignFields.length) {
        log(`assignFields [${assert.assignFields}]`, srcPath, destPath)
        const srcJSON = require(srcPath)
        let destJSON = require(destPath)

        assert.assignFields.forEach(field => {
            destJSON[field] = _.assign({}, destJSON[field], srcJSON[field])
        })

        fs.writeFile(destPath, JSON.stringify(destJSON, null, 2), 'utf-8')
    }
}

function isExist(path, type) {
    let ok = false
    try {
        const stat = fs.statSync(path)
        if (type === 'file' && stat.isFile()) ok = true
        if (type === 'dir' && stat.isDirectory()) ok = true
    } catch (e) {
        ok = false
    }
    return ok
}

function log(action, src, dest) {
    console.log(chalk.green(action + ' '), src, chalk.green('\n       to '), dest)
    console.log('')
}


function sync(asserts, srcRootPath, destRootPath) {
    fs.ensureDirSync(destRootPath)

    asserts.forEach(function (assert) {
        if (SYNC_FUNC_MAP[assert.type]) {
            SYNC_FUNC_MAP[assert.type](assert, srcRootPath, destRootPath)
        } else {
            console.error('No support type :', assert)
        }
    })
}

module.exports = sync
