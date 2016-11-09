// 具体参数配置
var OUTPUT_ENV = {
    DEV:{
        TITLE:'O2-示例', // 页面标题
        PUBLIC_PATH: '/', // 静态资源地址
        CSS_INTERNAL: false // 样式是否内联，默认为false, 打开则动态append到header中
    },
    PRODUCTION:{
        PUBLIC_PATH: './'
    }
}

module.exports = OUTPUT_ENV
