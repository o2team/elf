require('src/body.html')
require('src/css/main.scss')

var Preloader = require('./lib/preloader.js')


/**
 * init
 */
function init () {
    console.log('init ok')
}


/**
 * preloader && start
 */
var preloader = new Preloader({
    resources: [],
    perMinTime: 1000 // 加载每个资源所需的最小时间，一般用来测试 loading
})
preloader.addProgressListener(function (loaded, length) {
    console.log('loaded', loaded, length, loaded / length)
})
preloader.addCompletionListener(function () {
    $('#o2_loading').remove()
    $('#o2_main').removeClass('hide')

    init()
})
preloader.start()
