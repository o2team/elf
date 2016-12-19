#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const program = require('commander')
const templatesRootPath = path.join(__dirname, '../templates')

const dirs = fs.readdirSync(templatesRootPath)

console.log()
console.log('  All templates:')
console.log()
dirs.forEach(dir => console.log('      - ' + dir))
console.log()
console.log('  You can base on template init project:')
console.log()
console.log('      elf init -t ' + dirs[0])
console.log()
