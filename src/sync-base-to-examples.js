const path = require('path')
const fs = require('fs-extra')
const sync = require('./sync.js')

const asserts = require('../base/asserts.json').asserts
const srcRootPath = path.join(__dirname, '../base')
const destRootPath = path.join(__dirname, '../examples/slide')

sync(asserts, srcRootPath, destRootPath)
