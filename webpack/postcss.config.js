const _ = require('lodash')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const sprites = require('postcss-sprites')
const assets = require('postcss-assets')
const px2rem = require('postcss-plugin-px2rem')

const allConfig = require('../config/index.js')
const NODE_ENV = process.env.NODE_ENV || ''
const config = _.merge({}, allConfig, allConfig[NODE_ENV.toUpperCase()])

const postcssPlugins = [].concat(allConfig.postcssPlugins)

// assets
postcssPlugins.push(assets(config.assetsOptions))

// sprites
const spritesOptions = config.spritesOptions
if (config.enableREM) {
  const updateRule = require('postcss-sprites/lib/core').updateRule

  spritesOptions.hooks = {
    onUpdateRule: function (rule, token, image) {
      updateRule(rule, token, image)

      rule.insertAfter(rule.last, postcss.decl({
        prop: 'background-size',
        value: image.spriteWidth / image.ratio + 'px ' + image.spriteHeight / image.ratio + 'px;'
      }))
    }
  }
}
if (config.enableSpritesOnDev || NODE_ENV === 'production') {
  postcssPlugins.push(sprites(spritesOptions))
}

// px2rem
if (config.enableREM) {
  postcssPlugins.push(px2rem(_.assign(config.px2remOptions, {
    rootValue: config.designLayoutWidth / config.baseSize,
  })))
}

// autoprefixer
postcssPlugins.push(autoprefixer(config.autoprefixerOptions))

module.exports = function () {
  return postcssPlugins
}
