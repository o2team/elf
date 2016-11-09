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

page.get = function(idx){
    return _pageEmpty
}

module.exports = page;