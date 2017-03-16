#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')

program
  .option('-t, --template <template>', 'set template when init')
  .option('-c, --clone', 'use git clone')
  .parse(process.argv)

let destPath = program.args[0] || '.'
let isCurrent = destPath === '.'
destPath = path.resolve(destPath)

let template = 'base' // default use `base` template
if (program.template) template = program.template
if (!~template.indexOf('/')) template = `elf-templates/${template}`

const clone = program.clone || false

if (fs.existsSync(destPath)) {
  inquirer.prompt([{
    type: 'confirm',
    message: isCurrent ?
      'Init project in current directory ?' :
      'Target directory already exists. Are you continue ?',
    name: 'ok'
  }]).then(function (answers) {
    if (answers.ok) init(template, destPath)
  })
} else {
  init(template, destPath)
}

function init(from, to) {
  const spinner = ora('Downloading template').start()
  download(from, to, { clone }, function (err) {
    spinner.stop()
    if (err) {
      console.log('')
      console.log('  Failed to download repo ' + chalk.red(template) + ': ' + err.message.trim())
      console.log('')
    } else {
      console.log('')
      console.log('  Base on ' + chalk.green(template) + ' init project success')
      console.log('')
      if (program.args[0]) {
        console.log(chalk.cyan('  $ cd ' + program.args[0] + ' && npm install'))
      } else {
        console.log(chalk.cyan('  $ npm install'))
      }
      console.log(chalk.cyan('  $ elf start'))
      console.log('')
    }
  })
}
