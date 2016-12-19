#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const program = require('commander')
const sync = require('../src/sync.js')

program
  .option('-t, --template <template>', 'set template when init')
  .parse(process.argv)

let destPath = program.args[0] || '.'
let templatePath, asserts
let template = 'base'

if (program.template) template = program.template

templatePath = path.join(__dirname, '../templates', template)
destPath = path.resolve(destPath)

try {
  asserts = require(path.join(templatePath, '.asserts.json')).asserts
} catch (err) {
  console.log('')
  console.log('  Can\'t found template: ' + program.template)
  console.log('')
  console.log('  Execute `elf list` show all program.templates.')
  console.log('')
  return
}

sync(asserts, templatePath, destPath)

console.log('')
if (program.args[0]) {
  console.log(chalk.cyan('  $ cd ' + program.args[0] + ' && npm install'))
} else {
  console.log(chalk.cyan('  $ npm install'))
}
console.log(chalk.cyan('  $ elf start'))
console.log('')
