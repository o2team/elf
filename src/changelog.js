const fs = require('fs')
const path = require('path')
const conventionalChangelog = require('conventional-changelog')

conventionalChangelog({
  preset: 'angular'
}).pipe(fs.createWriteStream(path.resolve(__dirname, '../doc/CHANGELOG.md')))
