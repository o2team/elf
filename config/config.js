// 具体参数配置
var OUTPUT_ENV = {
    DEV:{
        IP: '127.0.0.1', // 可以配置你自己的IP，局域网下方便手机调试
        PROJECTPATH: 'example-threejs'
    },
    PRODUCTION:{
        PUBLICPATH: './',
        PROJECTPATH: 'example-threejs'
    }
}

module.exports = OUTPUT_ENV
