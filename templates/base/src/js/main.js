require('../index.html')
require('../css/main.scss')

var Preloader = require('preloader.js')

/**
 * init
 */
function init() {
  console.log('init ok')
}

/**
 * preloader && start
 */
var preloader = new Preloader({
  resources: [],
  concurrency: 4,
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
