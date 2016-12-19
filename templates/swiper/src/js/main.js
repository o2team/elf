require('src/index.html')
require('src/css/main.scss')

require('swiper/dist/css/swiper.css')
require('swiper/dist/js/swiper.js')
var Preloader = require('preloader.js')

/**
 * init
 */
function init() {
  var mySwiper = new Swiper('#o2_swiper', {
    direction: 'vertical'
  })
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
