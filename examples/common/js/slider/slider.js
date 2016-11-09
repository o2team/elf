(function (root, factory) {
    require('../lib/zepto-touch.js')
    if(window.Zepto){
         module.exports = factory(Zepto)
    }
}(this, function ($) {
	'use strict';

    var _defualtOption = {
        index: 0,
        container_cls: 'slider',
        card_cls: 'slider-card',
        prefix_cls: 'slider'
    }

    var Slider = function(selector, options){
        this.$el = $(selector)
        var opts = $.extend({}, _defualtOption, options)
        this._init(opts)
    }

    Slider.fn = Slider.prototype

    /**
     * 初始化
     */
    Slider.fn._init = function(opts){
        
        this.opts = opts
        this.collections = this.$el.find('.' + this.opts.card_cls)
        this.cls = this.opts.prefix_cls ? [this.opts.prefix_cls + '-in',this.opts.prefix_cls + '-out', this.opts.prefix_cls + '-active'] : ['in', 'out', 'active']
        this.idx = this.opts.index
        this.to(this.idx)
        this._isInAnimation = false;
        
        this._initEvent()
    }

    /**
     * 初始化事件
     */
    Slider.fn._initEvent = function(){
        
        this.$el.on('swipeRight', $.proxy(this.prev, this));
        this.$el.on('swipeDown', $.proxy(this.prev, this));

        this.$el.on('swipeLeft', $.proxy(this.next, this));
        this.$el.on('swipeUp', $.proxy(this.next, this));

        this.$el.on('sliderOut', $.proxy(function(event, idx){
            this.opts.sliderOut(this, idx)
        }, this) || $.noop)

        this.$el.on('resetSlider', $.proxy(function(event, idx){
            this.opts.resetSlider(this, idx)
        }, this) || $.noop)

        this.$el.on('sliderIn', $.proxy(function(event, idx){
            this.opts.sliderIn(this, idx)
        }, this) || $.noop)
    }


    /**
     * 翻页
     */
    Slider.fn.to = function(idx){
        if( (idx < this.collections.length && idx >= 0) ){
            if(idx == this.idx) {
                $(this.collections[this.idx])
                    .addClass(this.cls[0])
                    .addClass(this.cls[2])
            }else{
                if($(this.collections[this.idx]).hasClass(this.cls[0])) {
                    $(this.collections[this.idx])
                        .removeClass(this.cls[0])
                        .addClass(this.cls[1])
                    this._lastidx = idx;
                    this.$el.trigger('sliderOut', this.idx)
                }else{
                    $(this.collections[this.idx])
                        .removeClass(this.cls[1])
                        .removeClass(this.cls[2])
                    $(this.collections[idx])
                        .addClass(this.cls[0])
                        .addClass(this.cls[2])
                    this.$el.trigger('resetSlider', this.idx)
                    this.idx = idx
                    this._lastidx = 0;
                    this.$el.trigger('sliderIn', idx)
                }
                
            }
        }
    }

    Slider.fn.next = function(){
        if(this._isInAnimation)
            return
        if(this.idx < this.collections.length - 1){
            this._isInAnimation = true
            this.to(this.idx + 1)
        }
    }

    Slider.fn.prev = function(){
        if(this._isInAnimation)
            return
        if(this.idx > 0){
            this._isInAnimation = true
            this.to(this.idx - 1)
        }
    }

    /**
     * 继续翻页 从 out -> in
     */
    Slider.fn.countinue = function(){
        if(this._lastidx >= 0 && this._lastidx < this.collections.length ){
            this.to(this._lastidx)
            this._isInAnimation = false
        }
    }

    return Slider
}));
