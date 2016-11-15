require('src/body.html')
require('src/css/main.scss')

var Preloader = require('./lib/preloader.js')

var preloader = new Preloader({
    resources: ['aa', 'bb'],
    perMinTime: 1000 // 加载每个资源所需的最小时间，一般用来测试 loading
})
preloader.addProgressListener(function (loaded, length) {
    console.log('loaded', loaded, length, loaded / length)
})
preloader.addCompletionListener(function () {
    $('#o2_loading').remove()
    $('#o2_main').removeClass('hide')
})
preloader.start()
