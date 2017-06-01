module.exports = {
  devPort: '8000', // dev server 运行的端口

  designLayoutWidth: 750, // 设计稿的宽度 | 默认750，如果开启 Zoom 则直接按照设计稿宽度和屏幕宽度进行缩放
  designLayoutHeight: 1206, // 设计稿的高度 | 默认1206，如果开启 Zoom 则直接按照设计稿高度和屏幕高度进行缩放
  baseZoomRuler: 'width', // Zoom 缩放的基准 | 默认为 'width'，以屏幕的宽度进行缩放
  baseSize: 10, // 计算 rem 的基数，通常不用修改
  enableREM: true, // 是否用 rem 做适配
  enableZoom: true, // 是否用 zoom 做适配


  /* 如果不了解 webpack 的配置，请不要修改下面的配置项 */

  /**
   * webpack base config
   */
  entry: 'src/js/main.js',
  output: {
    path: 'dist',
    publicPath: './',
    filename: 'js/bundle.js?[hash:6]'
  },
  imgLoaderQuery: {
    limit: 1000,
    name: 'img/[name].[ext]?[hash:6]'
  },
  audioLoaderQuery: {
    name: 'plugin/[name].[ext]?[hash:6]'
  },
  // 该目录下的的图片默认被转成 base64
  imgToBase64Dir: /src\/img-base64/,
  externals: {},

  /**
   * html-webpack-plugin 默认配置
   * 详细描述参考：https://github.com/ampedandwired/html-webpack-plugin
   */
  htmlWebpackPluginOptions: {
    template: 'src/index.html'
  },

  /**
   * CommonsChunkPlugin 默认配置
   * 详细描述参考：https://webpack.js.org/plugins/commons-chunk-plugin/
   */
  commonsChunkPluginOptions: {},

  /**
   * autoprefixer 默认配置
   * 详细描述参考：https://github.com/postcss/autoprefixer
   */
  autoprefixerOptions: {
    browsers: ['iOS >= 5', 'Android >= 2.3'],
    cascade: false
  },

  /**
   * postcss-assets 默认配置
   * 详细描述参考：https://github.com/assetsjs/postcss-assets
   */
  assetsOptions: {
    loadPaths: ['src/img/']
  },

  /**
   * postcss-sprites 默认配置
   * 详细描述参考：https://github.com/2createStudio/postcss-sprites
   */
  enableSpritesOnDev: false, // 是否在 dev 时合成雪碧图
  spritesOptions: {
    stylesheetPath: 'src/css/',
    spritePath: 'src/img/',
    retina: true,
    relativeTo: 'rule',
    spritesmith: {
      algorithm: 'left-right',
      padding: 2
    },
    verbose: false,
    // 将 img 目录下的子目录作为分组，子目录下的 png 图片会合成雪碧图
    groupBy: function (image) {
      var reg = /img\/(\S+)\/\S+\.png$/.exec(image.url)
      var groupName = reg ? reg[1] : reg
      return groupName ? Promise.resolve(groupName) : Promise.reject()
    },
    // 非 img 子目录下面的 png 不合
    filterBy: function (image) {
      return /img\/\S+\/\S+\.png$/.test(image.url) ? Promise.resolve() : Promise.reject()
    }
  },

  /**
   * postcss-plugin-px2rem 默认配置
   * 详细描述参考：https://github.com/ant-tool/postcss-plugin-px2rem
   */
  px2remOptions: {
    // rootValue 由 config.designLayoutWidth / config.baseSize 而来，不用配置
    unitPrecision: 5,
    propWhiteList: [],
    propBlackList: [],
    selectorBlackList: [/.ignore-rem/],
    ignoreIdentifier: false,
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
  },

  /**
   * webpack development config
   *
   * 只作用于 development 模式，会覆盖 base config 中相同的配置项
   **/
  DEVELOPMENT: {
    // 配置是否在 Terminal 显示测试链接二维码
    enableDisplayQR: false
  },

  /**
   * webpack production config
   *
   * 只作用于 production 模式，会覆盖 base config 中相同的配置项
   **/
  PRODUCTION: {
    // 生成的 css 文件路径
    outputCss: 'css/app.css?[hash:6]',
    outputCssPublicPath: '../',

    /**
     * uglifyjs-webpack-plugin 默认配置
     * 详细描述参考：https://github.com/webpack-contrib/uglifyjs-webpack-plugin#options
     */
    uglifyjsPluginOptions: {
      compress: {
        warnings: false
      }
    },

    /**
     * html-webpack-plugin 默认配置
     * 详细描述参考：https://github.com/jantimon/html-webpack-plugin#configuration
     */
    htmlWebpackPluginOptions: {
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true
      }
    },

    /**
     * image-webpack-loader 默认配置
     * 详细描述参考：https://github.com/tcoopman/image-webpack-loader#usage
     */
    enableImageMin: true, // 是否启用 image-webpack-loader 对图片进行压缩
    imageWebpackLoader: {
      mozjpeg: {
        quality: 65
      },
      pngquant: {
        quality: "65-90",
        speed: 4
      },
      svgo: {
        plugins: [{
          removeViewBox: false
        }, {
          removeEmptyAttrs: false
        }]
      },
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7,
        interlaced: false
      }
    }
  }
}
