var path = require('path')

module.exports = {
  devPort: '8000', // dev server 运行的端口
  designLayoutWidth: 750, // 设计稿的宽度 默认750,如果开启 Zoom 则直接按照设计稿和屏幕宽度进行缩放
  enableREM: true, // 是否用rem做适配
  enableZoom: true, // 是否用Zoom做适配

  /*********** webpack base config ***********/
  entry: [
    'src/js/main.js'
  ],
  output: {
    path: 'dist',
    publicPath: '/',
    filename: 'js/bundle.js'
  },
  imgLoaderQuery: {
    limit: 1000,
    name: 'img/[name].[ext]'
  },
  audioLoaderQuery: {
    name: 'plugin/[name].[ext]'
  },
  externals: {},
  htmlWebpackPluginOptions: {
    template: 'src/index.html'
  },

  /*********** webpack development config ***********/
  DEVELOPMENT: {
  },

  /*********** webpack production config ***********/
  PRODUCTION: {
    imageWebpackLoader: { // build 时，图片的压缩配置
      progressive: true,
      optimizationLevel: 7,
      interlaced: false,
      mozjpeg: {
        quality: 65
      },
      pngquant: {
        quality: '65-90',
        speed: 4
      },
      svgo: {
        plugins: [{
          removeViewBox: false
        }, {
          removeEmptyAttrs: false
        }]
      }
    }
  }
}
