const path = require('path')
const sync = require('./sync')

let srcPath = process.argv[2]
let destPath = process.argv[3]
if (srcPath === undefined || destPath === undefined) {
    console.error('must input src and dest')
    process.exit(1)
}
srcPath = path.resolve(srcPath)
destPath = path.resolve(destPath)

try {
    require(path.join(srcPath, '.asserts.json'))
} catch (err) {
    console.error('src must include asserts.json')
    process.exit(1)
}

const asserts = require(path.join(srcPath, '.asserts.json')).asserts
sync(asserts, srcPath, destPath)
