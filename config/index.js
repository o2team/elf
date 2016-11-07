var _ = require('lodash')
var OUTPUT_ENV = require('./config.js')

var config = {}

// 开发参数配置， 请勿配置此文件，配置文件为，config.js
var SYSTEM_CONFIG = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    RESPONSIVE_REM: true, //是否用rem做适配
    RESPONSIVE_ZOOM: true, //是否用Zoom做适配
    OUTPUT_PATH: 'project',
    PORT: '3007',
    EXTERNALS:{},
    DESIGN_WIDTH: 750, // 设计稿的宽度 默认750,如果开启Zoom 则直接按照设计稿和屏幕宽度进行缩放
    IP:'localhost', //默认 localhost
    PUBLISH_IMAGEMIN: { // 发布的图片压缩配置
        optimizationLevel: 7, 
        interlaced: false,
        pngquant:{
            quality: "65-90",
            speed: 4
        }
    }
}

// 项目参数配置默认
var PROJECT_CONFIG = {
    TITLE:'O2-示例', // 页面标题
    PUBLICPATH: '/', // 静态资源地址，非通天塔使用参数, npm run build-ttt 忽略此参数
    CSSINTERNAL: false // 样式是否内联，默认为false, 打开则动态append到header中
}

if(process.env.NODE_ENV == 'production'){
    PROJECT_CONFIG = _.assignIn(PROJECT_CONFIG, OUTPUT_ENV.PRODUCTION)
}else{
    PROJECT_CONFIG = _.assignIn(PROJECT_CONFIG, OUTPUT_ENV.DEV)
}

var config = _.assignIn({}, SYSTEM_CONFIG, PROJECT_CONFIG)

module.exports = config;