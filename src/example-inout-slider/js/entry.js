var Slider = require('../../common/js/slider/slider.js')

var Launcher = require('../../common/js/Launcher.js')

var page = require('./page.js')

Launcher({
    bgMusic: 'plugin/bg.mp3',
    hasMusic:false,
    loadResources: ['../img/sprite.icon.png','plugin/bg.mp3'],
    callback : start
})

function start(){
    //TODO 初始化滑屏幕组件
    new Slider('.slider', {
        sliderOut: function(slider, idx){
            page.get(idx).slideOut($.proxy(slider.countinue, slider))
        },
        sliderIn: function(slider, idx){
            page.get(idx).slideIn()
        },
        resetSlider: function(slider, idx){
            page.get(idx).reset()
        }
    })
}

