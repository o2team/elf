var path = require('path')

module.exports = {
    TITLE: 'HTML5 SPA Boilerplate', // 页面标题
    PUBLIC_PATH: '/', // 静态资源地址
    PORT: '8000', // dev server 运行的端口
    DESIGN_WIDTH: 750, // 设计稿的宽度 默认750,如果开启 Zoom 则直接按照设计稿和屏幕宽度进行缩放
    RESPONSIVE_REM: true, // 是否用rem做适配
    RESPONSIVE_ZOOM: true, // 是否用Zoom做适配
    NODE_ENV: process.env.NODE_ENV || 'development',
    PROJECT_ROOT: path.resolve(__dirname, '..'),

    CSS_INTERNAL: false, // build 时，样式是否内联，默认为 false；如果为 true，则将样式附加到 html header 中作为内联样式
    EXTERNALS: {},
    OUTPUT_PATH: 'dist', // build 时，生成的文件夹
    PUBLISH_IMAGEMIN: { // build 时，图片的压缩配置
        optimizationLevel: 7,
        interlaced: false,
        pngquant: {
            quality: "65-90",
            speed: 4
        }
    }
}
