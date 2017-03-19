#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// new version update notification
updateNotifier({ pkg, updateCheckInterval: 0 }).notify()

program
  .version(pkg.version)
  .command('init', 'init project')
  .command('list', 'list all templates')
  .command('start', 'run on develpoment mode')
  .command('build', 'build for production')

program.on('--help', function(){
  console.log('  Examples:')
  console.log('')
  console.log('    # Init project')
  console.log('    $ elf init')
  console.log('')
  console.log('    # Base on template init project')
  console.log('    $ elf init -t panorama')
  console.log('')
  console.log('    # See all templates')
  console.log('    $ elf list')
  console.log('')
  console.log('    # See specific subcommand help')
  console.log('    $ elf help init')
  console.log('')
  console.log('')
})

program.parse(process.argv)

// console.log('! program:', program)
// console.log('!================')

// if (!process.argv.slice(2).length) {
//   program.outputHelp()
// }
if (!program.runningCommand) {
  console.log('')
  console.log('  Unknow command: ' + program.args.join(' '))
  console.log('')
  console.log('  See help `elf help`')
  console.log('')
  // program.help()
}
