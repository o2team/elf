require('../../common/js/motion/loader/loader.js')
require('../../common/js/motion/base/base.js')
var Event = new mo.Base()

var _EVENT_LOADING_ = 'loader.Loading',
    _EVENT_COMPLATE_ = 'loader.Complete',
    $el = $('#J_loading'),
    $text = $('#J_loading .loading-percent'),
    $ware = $('#J_loading .wave'),
    $mask = $('#J_loading .loading_mask')

var _loaded = {}

var getResources = function(images_urls){
    return images_urls
}

var loader = function(arr){
    arr = getResources(arr);
    new mo.Loader(arr, {
        onLoading : function(count,total, url, obj){
            _loaded[url] = obj
            Event.trigger(_EVENT_LOADING_, (count/total * 100).toFixed(2))
        },
        onComplete : function(time){
            Event.trigger(_EVENT_COMPLATE_, time)
        },
        concurrency: 2
    })
    return loader
}

loader.destory = function(){
    Event.off(_EVENT_LOADING_, loader.loading)
    Event.off(_EVENT_COMPLATE_, loader.complete)
    // $el.hide()
}

loader.complete = function(obj, time){
    console.info('加载时长:' + time + 'ms')
    loader.destory()
    loader.done(loader)
}
loader.done = function(cb){
    if(cb && typeof cb == 'function'){
        loader.done = cb
    }
}
loader.loading = function(context, percent){
    // -50 -90 -150
    // 0   99  100
    if (percent < 32) {
        percent = 32
    } else if (percent < 100) {
        var p = -50 - 40*(percent/100)
        $ware.css({'transform': 'translateY(' + p + '%)'})
    } else {
        $ware.css({'transform': 'translateY(-170%)'})
    }
    $text.text(percent + '%')
}

loader.get = function(url){
    return _loaded[url] || false
}

Event.on(_EVENT_LOADING_, loader.loading)
Event.on(_EVENT_COMPLATE_, loader.complete)

module.exports = loader;