#!/usr/bin/env node

const spawn = require('cross-spawn')
const program = require('commander')

program
  .option('-d, --debug <key>', 'print `key` corresponding configuration')
  .parse(process.argv)

const result = spawn.sync(
  'node', [
    require.resolve('../src/build'), 
    program.debug ? program.debug : ''
  ].concat(program.args), {
    stdio: 'inherit'
  }
)
process.exit(result.status)
