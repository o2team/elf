require('../index.html')
require('../css/main.scss')

require('zepto.js/src/detect.js')
require('zepto.js/src/fx.js')
require('zepto.js/src/fx_methods.js')
var makeVideoPlayableInline = require('iphone-inline-video')

var $tip = $('.tip')

/**
 * 判断微信里 TBS 的版本
 */
var ua = window.navigator.userAgent
var TBS = ua.match(/TBS\/([\d.]+)/)
var TBS_V0 = '036849' // TBS >=036849 支持 x5-video-player-type
var TBS_V1 = '036900' // TBS >=036900 正确支持 x5videoenterfullscreen，036849 <= TBS < 036900 支持的 x5videoxxxx 事件是反的

var QQB = ua.match(/MQQBrowser\/([\d.]+)/)
var QQB_V0 = '7.1' // MQQBrowser >=7.1 支持 x5-video-player-type
var QQB_V1 = '7.2' // MQQBrowser >=7.2 正确支持 x5videoenterfullscreen，7.1 <= TBS < 7.2 支持的 x5videoxxxx 事件是反的

var tbs = {}
if (TBS) {
  tbs.isTBS = true
  tbs.isRightEvent = TBS[1] >= TBS_V1
  if (TBS[1] >= TBS_V0) {
    useH5Play()
  }
} else if (QQB) {
  tbs.isTBS = true
  tbs.isRightEvent = QQB[1] >= QQB_V1
  if (QQB[1] >= QQB_V0) {
    useH5Play()
  }
}

if (TBS) {
  $tip.append('TBS:' + TBS[0] + ' | ' + TBS[1] + '<br>')
} else {
  $tip.append('TBS:' + TBS + '<br>')
}
if (QQB) {
  $tip.append('MQQBrowser:' + QQB[0] + ' | ' + QQB[1] + '<br>')
} else {
  $tip.append('MQQBrowser:' + QQB + '<br>')
}

function useH5Play() {
  $('#video').attr('x5-video-player-type', 'h5')
  $('#video').attr('x5-video-player-fullscreen', 'true')
}

/**
 * video
 */
var video = {}
video.el = document.getElementById('video')
video.$el = $(video.el)
video.$main = $('.main')
video.$wrapper = $('.main .wrapper')
video.$poster = $('.main .poster')
video.$skipBtn = $('.main .skip')
video.$continueBtn = $('.main .continue')
video.isCanPlay = false
video.isFirst = true
video.show = function () {
  video.isFirst = false

  video.$el.addClass('show')
  video.$main.show()
  video.$el.fadeIn()
  video.$poster.fadeOut()
}
video.start = function () {
  video.$poster.show()
  video.el.play()

  if (video.isCanPlay) {
    video.show()
  }
}

video.el.addEventListener('timeupdate', function (e) {
  if (video.el.currentTime > 3) {
    video.$skipBtn.show()
  }

  if (video.isFirst) {
    video.show()
  }
  video.isCanPlay = true
})

video.el.addEventListener('ended', function (e) {
  video.$main.fadeOut()
  end.enter()
})

// 处理 iOS 的兼容性
if ($.os.ios) {
  makeVideoPlayableInline(video.el)
}

// 处理 tbs/QQBrowser 的兼容性
if (tbs.isTBS) {
  video.el.addEventListener("x5videoenterfullscreen", function () {
    $tip.append("x5video enter fullscreen<br>");

    if (tbs.isRightEvent) {
      video.$skipBtn.hide()
      video.$continueBtn.hide()
    } else {
      video.$skipBtn.show()
      video.$continueBtn.show()
    }
  })

  video.el.addEventListener("x5videoexitfullscreen", function () {
    $tip.append("x5video exit fullscreen<br>");

    if (tbs.isRightEvent) {
      video.$skipBtn.show()
      video.$continueBtn.show()
    } else {
      video.$skipBtn.hide()
      video.$continueBtn.hide()
    }
  })
}


/**
 * end
 */
var end = {}
end.$ = $('#o2_end')
end.enter = function () {
  $('.end').removeClass('hide')
}
end.leave = function () {
  $('.end').addClass('hide')
}

/**
 * event bind
 */
$('body').on('touchstart', function (e) {
  e.preventDefault()
})

$('.begin').on('touchstart', function () {
  $('.loading').hide()
  $('.main').show()

  video.start()
})

$('.skip').on('touchstart', function () {
  end.enter()
  video.el.pause()
  video.el.currentTime = '0'

  $('.main').hide()
})

$('.continue').on('touchstart', function () {
  video.el.play()
})

$('.replay').on('touchstart', function () {
  end.leave()
  $('.main').show()

  video.start()
})


// 计算 wrapper 的 margin-top 值，视频以宽度为基准居中播放
function handleResize() {
  var sWidth = 9
  var sHeight = 16
  var width = window.innerWidth
  var height = window.innerHeight

  // window.alert('resize:' + width + ':' + height)

  var marginTop = height - (width * sHeight) / sWidth
  marginTop = Math.round(marginTop)
  if (marginTop < -2) {
    video.$wrapper.css('marginTop', marginTop / 2 + 'px')
  } else {
    video.$wrapper.css('marginTop', '0')
  }
}
handleResize()
window.addEventListener('resize', function () {
  handleResize()
})
