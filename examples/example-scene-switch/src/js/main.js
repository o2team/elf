require('src/body.html')
require('src/css/main.scss')

require('swiper/dist/css/swiper.css')
require('swiper/dist/js/swiper.js')

window.anime = require('animejs/anime.js')

// var loader = require('./loader.js')

// preloader
// require('../plugin/bg.mp3')

var loadImages = [
    '../img/flow-2.jpg',
    '../img/flow-step-3.jpg',
    '../img/city-1.jpg',
    '../img/flow-3.jpg',
    '../img/gift-1.jpg',
    '../img/city-2.jpg',
    '../img/flow-btn.jpg',

    '../img/city-map.jpg',
    '../img/flow-step-1.jpg',

    '../img/flow-1.jpg',
    '../img/flow-step-2.jpg',
    'plugin/bg.mp3'
]

/**
 * loading
 */
var loading = {}
loading.$ = $('#o2_loading')
loading.handleOver = function (done) {
    loading.$.hide()
    done && done()
}

/**
 * home
 */
var home = {}
home.$ = $('.home')
home.$txt = $('.home .home-txt')
home.start = function () {
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
                    elasticity: 600,
                },
            })
            anime({
                targets: '.home-txt',
                scale: {
                    value: [0, 1],
                    duration: 500,
                    easing: 'easeInOutExpo'
                },
                complete: function () {
                    // home.$txt.addClass('bounceIn')
                }
            })
        }
    })
}
home.end = function (done) {
    // if (!home.$.hasClass('swiper-slide-prev')) return

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
        },
        complete: function () {
            // home.$txt.addClass('bounceIn')
        }
    })

    meet1.setBegin()
}
home.setEnd = function () {
    $('.home .home-4, .home .home-txt').css({
        'transform': 'scale(1)'
    })
}

/**
 * meet1
 */
var meet1 = {}
meet1.$pic = $('.meet1 .meet-pic')
meet1.start = function (done) {
    anime({
        targets: '.meet1 .meet-bubble',
        scale: {
            value: [3, 0.5],
            delay: 0,
            duration: 500,
            easing: 'easeInOutExpo',
            elasticity: 800
        },
        complete: function () {
            anime({
                targets: '.meet1 .meet-bubble',
                scale: {
                    value: [0.5, 1.2],
                    // duration: 500,
                    duration: 1000,
                    elasticity: 600,
                    // easing: 'easeInOutExpo'
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
meet1.end = function (done) {
    anime({
        targets: ['.meet1 .meet-bubble'],
        scale: {
            value: [1.2, 0],
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

    meet2.setBegin()
}
meet1.setBegin = function () {
    $('.meet1 .meet-bubble').css({
        'transform': 'scale(3)'
    })
    $('.meet1 .meet-txt-1, .meet1 .meet-coffee').css({
        'transform': 'scale(0)'
    })
    meet1.$pic.removeClass('air-active')
}
meet1.setEnd = function (done) {
    $('.meet1 .meet-bubble, .meet1 .meet-txt-1, .meet1 .meet-coffee').css({
        'transform': 'scale(1.2)',
        'opacity': '1'
    })
    done && done()
}

/**
 * meet2
 */
var meet2 = {}
meet2.$pic = $('.meet2 .meet-pic')
meet2.start = function (done) {
    anime({
        targets: '.meet2 .meet-bubble',
        scale: {
            value: [0, 1.2],
            duration: 1400,
            elasticity: 600,
            easing: 'easeInOutExpo'
        }
    })

    anime({
        targets: ['.meet2 .meet-txt-2', '.meet2 .meet-coffee' ],
        scale: {
            value: [0, 1],
            duration: 1000,
            easing: 'easeInOutExpo'
        },
        opacity: {
            value: [0, 1],
            duration: 1000,
            easing: 'easeInOutExpo'
        },
        complete: function () {
            meet2.$pic.addClass('air-active')
            done && done()
        }
    })
}
// meet2.end = function (done) {
// }
meet2.setBegin = function () {
    $('.meet2 .meet-bubble').css({'transform': 'scale(0)'})
    $('.meet2 .meet-txt-2, .meet2 .meet-coffee').css({'transform': 'scale(0)'})
    meet2.$pic.removeClass('air-active')
}
// meet2.setEnd = function (done) {
//     done && done()
// }



/**
 * start
 **/
var $J_main = $('#o2_main'), audio

setTimeout(function() {
    loading.handleOver(function () {

        home.start()

        // audio = loader.get('plugin/bg.mp3')
        // audio.loop = true
        //audio.play()
    })

    $J_main.removeClass('hide')
    requestAnimationFrame(start)
}, 1000)


function start(){
    var isSwipering = false;

    var mySwiper = new Swiper('#o2_swiper', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        direction: 'vertical',
        followFinger: false,
        speed: 0,
        // virtualTranslate: true,
        // onTouchStart: function (swiper) {
        //     // mySwiper.unlockSwipes()
        //     console.log('onTouchStart:', swiper.swipeDirection, swiper.previousIndex, swiper.activeIndex)
        // },
        onTouchEnd: function (swiper) {
            // console.log('1 onTouchEnd:', swiper.swipeDirection, swiper.previousIndex, swiper.activeIndex)
            // console.log('2 isSwipering:', isSwipering)
            if (isSwipering) return
            isSwipering = true
            mySwiper.lockSwipes()
            if (swiper.swipeDirection === 'prev') {
                mySwiper.unlockSwipes()
                mySwiper.slidePrev(true, 300)
                isSwipering = false
            } else if (swiper.swipeDirection === 'next') {
                if (swiper.activeIndex === 0) {
                    home.end(function () {
                        mySwiper.unlockSwipes()
                        mySwiper.slideNext(true, 0)
                        meet1.start()
                        home.setEnd()
                    })
                } else if (swiper.activeIndex === 1) {
                    meet1.end(function () {
                        mySwiper.unlockSwipes()
                        mySwiper.slideNext(true, 0)
                        meet2.start()
                        meet1.setEnd()
                    })
                    // mySwiper.unlockSwipes()
                    // mySwiper.slideNext(true, 0)
                    // meet2.start()
                } else if (swiper.activeIndex === 5) {
                    mySwiper.unlockSwipes()
                    mySwiper.slideNext(true, 300)
                    isSwipering = false
                } else {
                    mySwiper.unlockSwipes()
                    mySwiper.slideNext(true, 300)
                    isSwipering = false
                }
            } else {
                isSwipering = false
            }
            // mySwiper.lockSwipes()
        },
        onTransitionEnd: function (swiper) {
            // console.log('3 onTransitionEnd:', swiper.swipeDirection, swiper.previousIndex, swiper.activeIndex)
            var activeIndex = swiper.activeIndex

            if (swiper.swipeDirection === 'prev') {
                if (activeIndex === 0) {
                    meet1.setBegin()
                } else if (activeIndex === 1) {
                    meet2.setBegin()
                }
            }
            if (activeIndex === 0 || activeIndex === 1 || activeIndex === 2) {
                $J_main.removeClass('audio-r')
            } else {
                $J_main.addClass('audio-r')
            }

            isSwipering = false
        }
    })

    $(document).on('touchstart', '.audio', function(){
        if($J_main.hasClass('audio-off')){
            $J_main.removeClass('audio-off')
            audio.play()
        }else{
            $J_main.addClass('audio-off')
            audio.pause()
        }
    })
}

