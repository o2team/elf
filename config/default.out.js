/**
 * ELF 配置文件
 *
 * 详细说明：https://github.com/o2team/elf/blob/master/doc/CONFIGURATION.md
 */
module.exports = {
  devPort: '8000', // dev server 运行的端口
  designLayoutWidth: 750, // 设计稿的宽度 | 默认750，如果开启 Zoom 则直接按照设计稿宽度和屏幕宽度进行缩放
  designLayoutHeight: 1206, // 设计稿的高度 | 默认1206，如果开启 Zoom 则直接按照设计稿高度和屏幕高度进行缩放
  baseZoomRuler: 'width', // Zoom 缩放的基准 | 默认为 'width'，以屏幕的宽度进行缩放
  baseSize: 10, // 计算 rem 的基数，通常不用修改
  enableREM: true, // 是否用 rem 做适配
  enableZoom: true, // 是否用 zoom 做适配

  /**
   * webpack base config
   */
  entry: 'src/js/main.js',
  output: {
    path: 'dist',
    publicPath: './',
    filename: 'js/bundle.js'
  },
  outputCss: 'css/app.css',
  outputCssPublicPath: '../',
  imgLoaderQuery: {
    limit: 1000,
    name: 'img/[name].[ext]'
  },
  audioLoaderQuery: {
    name: 'plugin/[name].[ext]'
  },
  imgToBase64Dir: /src\/img-base64/,

  /**
   * webpack development config
   *
   * 只作用于 development 模式，会覆盖 base config 中相同的配置项
   **/
  DEVELOPMENT: {},

  /**
   * webpack production config
   *
   * 只作用于 production 模式，会覆盖 base config 中相同的配置项
   **/
  PRODUCTION: {}
};
