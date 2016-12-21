require('src/index.html')
require('src/css/main.scss')

require('swiper/dist/css/swiper.css')
require('swiper/dist/js/swiper.js')
window.anime = require('animejs/anime.js')
var Preloader = require('preloader.js')

/**
 * home
 */
var home = {}
home.$ = $('.home')
home.$txt = $('.home .home-txt')
home.enter = function () {
  anime({
    targets: '.home-4',
    scale: {
      value: [3.8, 0.5],
      delay: 0,
      duration: 1000,
      easing: 'easeInOutExpo',
      elasticity: 800
    },
    complete: function () {
      anime({
        targets: '.home-4',
        scale: {
          value: [0.5, 1.2],
          duration: 1000,
          easing: 'easeOutElastic',
          elasticity: 600,
        },
      })
      anime({
        targets: '.home-txt',
        scale: {
          value: [0, 1],
          duration: 500,
          easing: 'easeInOutExpo'
        }
      })
    }
  })
}
home.leave = function (done) {
  anime({
    targets: '.home-4',
    scale: {
      value: [1, 3.8],
      duration: 1000,
      easing: 'easeInOutExpo'
    },
    complete: function () {
      done && done()
    }
  })
  anime({
    targets: '.home-txt',
    scale: {
      value: [1, 0],
      duration: 800,
      easing: 'easeInOutExpo'
    }
  })
}
home.stage = function () {
  $('.home .home-4').css({
    'transform': 'scale(1.2)'
  })
  $('.home .home-txt').css({
    'transform': 'scale(1)'
  })
}

/**
 * meet1
 */
var meet1 = {}
meet1.$pic = $('.meet1 .meet-pic')

meet1.prepare = function () {
  $('.meet1 .meet-bubble').css({
    'transform': 'scale(3)'
  })
  $('.meet1 .meet-txt-1, .meet1 .meet-coffee').css({
    'transform': 'scale(0)'
  })
  meet1.$pic.removeClass('air-active')
}
meet1.enter = function (done) {
  anime({
    targets: '.meet1 .meet-bubble',
    scale: {
      value: [3, 0.5],
      delay: 0,
      duration: 500,
      easing: 'easeInOutExpo',
    },
    complete: function () {
      anime({
        targets: '.meet1 .meet-bubble',
        scale: {
          value: [0.5, 1],
          duration: 1000,
          easing: 'easeOutElastic',
          elasticity: 600
        },
      })
      anime({
        targets: ['.meet1 .meet-txt-1', '.meet1 .meet-coffee'],
        scale: {
          value: [0, 1],
          duration: 500,
          easing: 'easeInOutExpo'
        },
        complete: function () {
          meet1.$pic.addClass('air-active')
          done && done()
        }
      })
    }
  })
}
meet1.leave = function (done) {
  anime({
    targets: ['.meet1 .meet-bubble'],
    scale: {
      value: [1, 0],
      duration: 1000,
      easing: 'easeInOutExpo'
    }
  })

  anime({
    targets: ['.meet1 .meet-txt-1', '.meet1 .meet-coffee'],
    scale: {
      value: [1, 0],
      duration: 1000,
      easing: 'easeInOutExpo'
    },
    opacity: {
      value: [1, 0],
      duration: 1000,
      easing: 'easeInOutExpo'
    },
    complete: function () {
      done && done()
    }
  })
}
meet1.stage = function () {
  $('.meet1 .meet-bubble, .meet1 .meet-txt-1, .meet1 .meet-coffee').css({
    'transform': 'scale(1)',
    'opacity': '1'
  })
}

/**
 * meet2
 */
var meet2 = {}
meet2.$pic = $('.meet2 .meet-pic')
meet2.prepare = function () {
  $('.meet2 .meet-bubble').css({
    'transform': 'scale(0) translateZ(0)'
  })
  $('.meet2 .meet-txt-2, .meet2 .meet-coffee').css({
    'transform': 'scale(0)'
  })
  meet2.$pic.removeClass('air-active')
}
meet2.enter = function (done) {
  anime({
    targets: '.meet2 .meet-bubble',
    scale: {
      value: [0, 1],
      duration: 1200,
      easing: 'easeOutElastic',
      elasticity: 600
    },
    translateZ: 0
  })

  anime({
    targets: ['.meet2 .meet-txt-2', '.meet2 .meet-coffee'],
    scale: {
      value: [0, 1],
      duration: 600,
      easing: 'easeInOutExpo'
    },
    complete: function () {
      meet2.$pic.addClass('air-active')
      done && done()
    }
  })
}


function init(done) {
  var isSwipering = false;

  var mySwiper = new Swiper('#o2_swiper', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    direction: 'vertical',
    followFinger: false,
    speed: 0,
    onTouchEnd: function (swiper) {
      if (isSwipering) return
      isSwipering = true
      mySwiper.lockSwipes()
      if (swiper.swipeDirection === 'prev') {
        mySwiper.unlockSwipes()
        mySwiper.slidePrev(true, 300)
        isSwipering = false
      } else if (swiper.swipeDirection === 'next') {
        if (swiper.activeIndex === 0) {
          home.leave(function () {
            mySwiper.unlockSwipes()
            mySwiper.slideNext(true, 0)
            meet1.enter()
            home.stage()
            meet2.prepare()
          })
        } else if (swiper.activeIndex === 1) {
          meet1.leave(function () {
            mySwiper.unlockSwipes()
            mySwiper.slideNext(true, 0)
            meet2.enter()
            meet1.stage()
          })
        } else {
          mySwiper.unlockSwipes()
          mySwiper.slideNext(true, 300)
          isSwipering = false
        }
      } else {
        isSwipering = false
      }

    },
    onTransitionEnd: function (swiper) {
      var activeIndex = swiper.activeIndex

      if (swiper.swipeDirection === 'prev') {
        if (activeIndex === 0) {
          meet1.prepare()
        } else if (activeIndex === 1) {
          meet2.prepare()
        }
      }

      isSwipering = false
    }
  })

  done && done()
}

/**
 * preloader && start
 */
var preloader = new Preloader()
preloader.addCompletionListener(function () {
  $('#o2_main').removeClass('hide')
  init()
  setTimeout(function () {
    $('#o2_loading').hide()
    home.enter()
    meet1.prepare()
  }, 1000)
})
preloader.start()
