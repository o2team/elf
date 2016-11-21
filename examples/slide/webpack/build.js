require('shelljs/global')
var path = require('path')
var webpack = require('webpack')
var buildWebpackConfig = require('./webpack.config.build')

var buildPath = buildWebpackConfig.output.path
rm('-rf', buildPath)
mkdir('-p', buildPath)

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
