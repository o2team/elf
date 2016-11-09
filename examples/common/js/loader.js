require('./motion/loader/loader.js')
require('./motion/base/base.js')
var Event = new mo.Base()

var _EVENT_LOADING_ = 'loader.Loading',
    _EVENT_COMPLATE_ = 'loader.Complete',
    $el = $('#J_loading'),
    $text = $('#J_loading .text')

var _loaded = {}
var _config = {
    onLoading : function(count,total, url, obj){
        _loaded[url] = obj
        Event.trigger(_EVENT_LOADING_, (count/total * 100).toFixed(2) + '%')
    },
    onComplete : function(time){
        Event.trigger(_EVENT_COMPLATE_, time)
    }
}

var getResources = function(images_urls){
    return images_urls
}

var loader = function(arr, options){
    arr = getResources(arr);
    new mo.Loader(arr, $.extend({}, _config, options))
    return loader
}

loader.load = function(arr, options){
    arr = getResources(arr);
    new mo.Loader(arr, $.extend({}, {onComplete : function(time){
        options.callback && options.callback(time)
    }}, options)) 
}

loader.destory = function(){
    Event.off(_EVENT_LOADING_, loader.loading)
    Event.off(_EVENT_COMPLATE_, loader.complete)
    $el.hide()
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
    return loader
}

loader.loading = function(context, percent){
    $text.text(percent)
}

loader.get = function(url){
    return _loaded[url] || false
}

Event.on(_EVENT_LOADING_, loader.loading)
Event.on(_EVENT_COMPLATE_, loader.complete)

module.exports = loader;