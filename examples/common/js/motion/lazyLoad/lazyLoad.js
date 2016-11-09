/**
 * @author AidenXiong
 * @version 1.0
 * @date 2014-09-16
 * @description 图片懒加载
 * @extends mo.Base
 * @name mo.LazyLoad
 * @requires lib/zepto.js
 * @param {HTMLElement} container=window 懒加载的容器 默认
 * @param {object} [opts] 配置参数
 * @param {number} [opts.threshold=0] 距离viewport的值
 * @param {dataAttr} [opts.dataAttr=original] 所有资源加载完成后的回调
 * @example
		var lazyload = new mo.LazyLoad(window, {
			'threshold' : 100,
			'dataAttr'  : 'original'
		});
 * @see lazyLoad/lazyLoad.html 资源懒加载
 * @class
*/
define(function(require, exports, module){
	require('../motion/motion.js');
	require('../base/base.js');
	Motion.add('mo.LazyLoad:mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.LazyLoad#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.LazyLoad.
		 * @ignore
		 */
		var _static = this.constructor;



		_public.constructor = function(container, config) {
			if (!container) {
				container = window;
			}
			this.init(container, config);
		}

		// 插件默认配置
		_static.config = {
			'threshold' : 0,
			'dataAttr' : 'original'
		};

		/**
		 * 事件绑定
		 * @return {[type]} [description]
		 */
		_private.bindEvent = function(){
			var _self = this;
			Zepto(_self.container).bind('pageshow resize scroll load', function(){
				_self.detect.call(_self);
			});
		}

		/**
		 * 判断节点是否在指定的范围之内显示
		 * @param  {HTMLElement} el        需要判断的元素
		 * @param  {number}      threshold 临界值
		 * @return {Boolean}     在显示范围之内返回true  否则false
		 */
		_private.inViewport = function(el, threshold){
			var rect     = el.getBoundingClientRect();
			var viewport = {
				left : 0 - threshold,
				top : 0 - threshold,
				right : Zepto(window).width() + threshold,
				bottom : Zepto(window).height() + threshold
			}

			return !(rect.top >= viewport.bottom
							|| rect.bottom <= viewport.top
							|| rect.right <= viewport.left
							|| rect.left >= viewport.right)
		}

		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(container, config) {
			var _self = this;
			_self.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			var config = _self.config;

			//属性处理
			Zepto.extend(_self, /** @lends mo.LazyLoad.prototype*/ {
				/**
				 * 懒加载容器
				 * @type {HTMLElement}
				 */
				container: container || window,
				/**
				 * 需要懒加载的元素列表
				 * @type {Array}
				 */
				list : Array.prototype.slice.call(container.querySelectorAll('[data-'+config.dataAttr+']'))
			});

			config.event && _self.on(config.event);
			
			_private.bindEvent.call(_self);
			_self.detect.call(_self);
		}

		/**
		 * 检测懒加载元素
		 * @return {[type]} [description]
		 */
		_public.detect = function(){
			var _self = this;
			Zepto(_self.list).each(function(index, el){
				if(!_private.inViewport(el, _self.config.threshold)){ //不在指定范围内的话   不执行操作
					return;
				}
				var attr = 'data-'+_self.config.dataAttr;
				var _el = Zepto(el);
				var originalSrc = _el.attr(attr);
				var type = _el.attr('data-type') || 'img'; //类型 img ajax script
				/**
				 * @event mo.LazyLoad#startLoading
				 * @property {object} event 单个资源开始加载
				 */
				_self.trigger('startLoading', el);

				//删除加载属性
				_el.removeAttr(attr);

				//从列表中删除该节点 减少下一次的循环
				_self.list = _self.list.filter(function(dom){
					return dom != el;
				});
				if(type == 'img'){ //图片
					Zepto('<img />').bind('load', function(){
						if(_el.is('img')){
							_el.attr('src', originalSrc)
						}else{
							_el.css('background-image','url('+originalSrc+')');
						}
						/**
						 * @event mo.LazyLoad#load
						 * @property {object} event 单个资源加载完成
						 */
						_self.trigger('load',[el, originalSrc]);
					}).attr('src',originalSrc);
				}else if(type == 'ajax'){ //ajax请求
					Zepto.ajax({
						type : 'GET',
						url : originalSrc,
						success : function(data){
							_self.trigger('load', [el, data]);
						},
						error : function(xhr, type){
							_self.trigger('error', [el,'error']);
						}
					});
				}else if(type == 'script'){
					var firstScript = document.getElementsByTagName('script')[0];
					var scriptHead = firstScript.parentNode;
					var re = /ded|co/;
					var onload = 'onload';
					var onreadystatechange = 'onreadystatechange'; 
					var readyState = 'readyState';
					var script = document.createElement('script');
					script[onload] = script[onreadystatechange] = function(){
						if(!this[readyState] || re.test(this[readyState])){
							script[onload] = script[onreadystatechange] = null;
							_self.trigger('load', [el, data]);
							script = null;
						}
					};
					script.async = true;
					script.src = originalSrc;
					scriptHead.insertBefore(script, firstScript);
				}
			});
			return _self;
		}

		/**
		 * 更新懒加载节点列表
		 * @return {[type]} [description]
		 */
		_private.updataList = function(){
			var _self = this;
			_self.list = Array.prototype.slice.call(container.querySelectorAll('[data-'+config.dataAttr+']'));
			return _self;
		}
	});
});