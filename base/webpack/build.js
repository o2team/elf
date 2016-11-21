var path = require('path')
var fs = require('fs-extra')
var webpack = require('webpack')
var buildWebpackConfig = require('./webpack.config.build')

var buildPath = buildWebpackConfig.output.path
fs.removeSync(buildPath)
fs.mkdirsSync(buildPath)

webpack(buildWebpackConfig, function (err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')
})
