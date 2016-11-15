const path = require('path')
const fs = require('fs-extra')
const sync = require('./sync.js')

const exampleRoot = path.join(__dirname, '../examples')
const srcPath = path.join(__dirname, '../base')
const asserts = require(path.join(srcPath, 'asserts.json')).asserts

const examples = fs.readdirSync(exampleRoot)

examples.forEach(example => {
    const destPath = path.join(exampleRoot, example)

    sync(asserts, srcPath, destPath)
})

