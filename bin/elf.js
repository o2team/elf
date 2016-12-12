#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const package = require('../package.json')
const sync = require('../src/sync.js')

const examplesRoot = path.join(__dirname, '../examples')

program.version(package.version)
program
  .option('-d, --dest [dir]', 'set destination directory when init, default: .')
  .option('-c, --case [case]', 'set extend case when init')

program
  .command('init [options]')
  .alias('i')
  .description('init project')
  // .option('-d, --dest [dir]', 'set destination directory')
  // .option('-c, --case [case]', 'set extend case')
  .action(function (options, prog) {
    options = prog.parent
    // console.log('options.case:', options.case, '; options.dest:', options.dest)

    let srcPath = '../base', destPath = '.'
    if (options.case) srcPath = '../examples/' + options.case
    if (options.dest) destPath = options.dest

    srcPath = path.join(__dirname, srcPath)
    destPath = path.resolve(destPath)
    try {
      const asserts = require(path.join(srcPath, '.asserts.json')).asserts
    } catch (err) {
      console.log('')
      console.log('  Can\'t found case: ', options.case)
      console.log('')
      console.log('  Execute `elf list` show all cases.')
      console.log('')
      return
    }

    sync(asserts, srcPath, destPath)
  })

program
  .command('list')
  .alias('ls')
  .description('list all cases')
  .action(function () {
    const dirs = fs.readdirSync(examplesRoot)

    console.log()
    console.log('    All cases:')
    console.log()
    dirs.forEach(dir => console.log('        - ' + dir))
    console.log()
    console.log('    You can base on case init project:')
    console.log()
    console.log('        elf init -c ' + dirs[0])
    console.log()
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
