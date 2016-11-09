var anime = require('../../common/js/lib/anime.js')
require('../index.html') // reload
require('../css/style.scss')
require('../plugin/bg.mp3')

var page = {}, _page = []

_pageEmpty = {
    slideOut: function(cb){
        console.info('Empty.slideOut')
        setTimeout(function() {
            cb && cb()
        }, 500); 
    },
    slideIn: function(){
        console.info('Empty.slideIn')
    },
    reset: function(){
        console.info('重置')
    }
}


_page[0] = function(){
    var idx = 0
    var cls_iris = '.iris0'

    return {
        slideOut: function(cb){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [0, 1],
                    duration: 500,
                    easing: 'easeInOutQuad'
                },
                complete:function(){
                    cb && cb()
                }
            })
        },
        slideIn: function(){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [1, 0],
                    duration: 500,
                    easing: 'easeInOutQuad'
                }
            })
        },
        reset: function(){
            console.info('重置' + idx)
        }
    }
}()

_page[1] = function(){
    var idx = 1
    var cls_iris = '.iris1'
    return {
        slideOut: function(cb){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [0, 1],
                    duration: 500,
                    easing: 'easeInOutQuad'
                },
                complete:function(){
                    cb && cb()
                }
            })
        },
        slideIn: function(){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [1, 0],
                    duration: 500,
                    easing: 'easeInOutQuad'
                }
            })
        },
        reset: function(){
            console.info('重置' + idx)
        }
    }
}()

_page[2] = function(){
    var idx = 2
    var cls_iris = '.iris2'
    return {
        slideOut: function(cb){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [0, 1],
                    duration: 500,
                    easing: 'easeInOutQuad'
                },
                complete:function(){
                    cb && cb()
                }
            })
        },
        slideIn: function(){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [1, 0],
                    duration: 500,
                    easing: 'easeInOutQuad'
                }
            })
        },
        reset: function(){
            console.info('重置' + idx)
        }
    }
}()

_page[3] = function(){
    var idx = 3
    var cls_iris = '.iris3'
    return {
        slideOut: function(cb){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [0, 1],
                    duration: 500,
                    easing: 'easeInOutQuad'
                },
                complete:function(){
                    cb && cb()
                }
            })
        },
        slideIn: function(){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [1, 0],
                    duration: 500,
                    easing: 'easeInOutQuad'
                }
            })
        },
        reset: function(){
            console.info('重置' + idx)
        }
    }
}()

_page[4] = function(){
    var idx = 4
    var cls_iris = '.iris4'
    return {
        slideOut: function(cb){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [0, 1],
                    duration: 500,
                    easing: 'easeInOutQuad'
                },
                complete:function(){
                    cb && cb()
                }
            })
        },
        slideIn: function(){
            var myanime = anime({
                targets: cls_iris,
                scale:{
                    value: [1, 0],
                    duration: 500,
                    easing: 'easeInOutQuad'
                }
            })
        },
        reset: function(){
            console.info('重置' + idx)
        }
    }
}()

page.get = function(idx){
    //return _page[idx] || _pageEmpty 使用anime
    return _pageEmpty
}

module.exports = page;