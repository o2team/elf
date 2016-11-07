/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-11-25
 * @description CSS3动画生成器 <br/> 一、提供javascript方法控制动画；二、提供事件接口监听动画；三、自动完成各平台兼容；四、提供大量内置动画，未使用时不插入。
 * @extends mo.Base
 * @name mo.Animation
 * @requires lib/zepto.js
 * @param {object} config.target 目标元素
 * @param {string} config.keyframes 动画关键帧设置，如果参数effect为空，该参数为必选
 * @param {string} [config.effect=''] 选择内置效果，也可以继续设置keyframes与内置效果叠加 <br/> 内置效果：flash, shake, swing, wobble, bounceIn, bounceInLeft, bounceInRight, bounceOut, bounceOutLeft, bounceOutRight, fadeIn, fadeOut, flip, flipInX, flipInY, flipOutX, flipOutY, rollIn, rollOut, zoomIn, zoomOut
 * @param {number} [config.duration=2000] 动画时间，单位ms
 * @param {string} [config.easing='swing'] 动画缓冲类型
 * @param {boolean} [config.autoPlay=true] 是否自动播放
 * @param {boolean} [config.fillMode='none'] none：默认值。不设置对象动画之外的状态<br/> forwards：设置对象状态为动画结束时的状态<br/> backwards：设置对象状态为动画开始时的状态<br/> both：设置对象状态为动画结束或开始的状态
 * @param {number} [config.delay=0] 设置对象动画延迟的时间，单位ms
 * @param {number|string} [config.iteration=1] 设置对象动画的循环次数。infinite为无限循环。
 * @param {string} [config.direction='normal'] 设置对象动画在循环中是否反向运动。<br/>normal：正常方向<br/> alternate正常与反向交替
 * @example
new mo.Animation({
	target: $(elem),
	effect: 'shake'
});	
 * @see animation/demo1.html 内置效果
 * @see animation/demo2.html 加载效果
 * @see animation/demo3.html 方法与事件
 * @class
*/
define(function(require, exports, module) {
	require('../base/base.js');




	Motion.add('mo.Animation:mo.Base', function() {

		/**
		 * public 作用域
		 * @alias mo.Animation#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Animation.
		 * @ignore
		 */
		// var _static = arguments.callee;
		var _static = this.constructor;

		var head = document.getElementsByTagName('head')[0] || document.documentElement;
		var styleElem = document.createElement('style');
		head.appendChild(styleElem);



		// 插件默认配置
		_static.config = {
			duration : 2000,
			easing: 'swing',
			autoPlay: true,
			fillMode: 'none',
			delay: 0,
			iteration: 1,
			direction: 'normal',
			effect: '',
			apply: true,
			keyframes: {}
		};

		_private.effect = {
			'flash': {
				'0,50,100': {opacity: 1},
				'25,75': {opacity: 0}
			},
			'shake': {
				'0,100': {transform: 'translate3d(0, 0, 0)'},
				'10, 30, 50, 70, 90': {transform: 'translate3d(-10px, 0, 0)'},
				'20, 40, 60, 80': {transform: 'translate3d(10px, 0, 0)'}
			},
			'swing':{
				'20': {transform: 'rotate3d(0, 0, 1, 15deg)'},
				'40': {transform: 'rotate3d(0, 0, 1, -10deg)'},
				'60': {transform: 'rotate3d(0, 0, 1, 5deg)'},
				'80': {transform: 'rotate3d(0, 0, 1, -5deg)'},
				'100': {transform: 'rotate3d(0, 0, 1, 0deg)'}
			},
			'wobble':{
				'0': {transform: 'none'},
				'15': {transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)'},
				'30': {transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)'},
				'45': {transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)'},
				'60': {transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)'},
				'75': {transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)'},
				'100': {transform: 'none'}
			},
			'bounceIn':{
				'0':{opacity: 0, transform: 'scale3d(.3, .3, .3)'},
				'20':{transform: 'scale3d(1.1, 1.1, 1.1)'},
				'40':{transform: 'scale3d(.9, .9, .9)'},
				'60':{opacity: 1, transform: 'scale3d(1.03, 1.03, 1.03)'},
				'80':{transform: 'scale3d(.97, .97, .97)'},
				'100':{opacity: 1, transform: 'scale3d(1, 1, 1)'}
			},
			'bounceInLeft':{
				'0':{opacity: 0, transform: 'translate3d(-3000px, 0, 0)'},
				'60':{opacity: 1, transform: 'translate3d(25px, 0, 0)'},
				'75':{transform: 'translate3d(-10px, 0, 0)'},
				'90':{transform: 'translate3d(5px, 0, 0)'},
				'100':{transform: 'none'}
			},
			'bounceInRight':{
				'0':{opacity: 0, transform: 'translate3d(3000px, 0, 0)'},
				'60':{opacity: 1, transform: 'translate3d(-25px, 0, 0)'},
				'75':{transform: 'translate3d(10px, 0, 0)'},
				'90':{transform: 'translate3d(-5px, 0, 0)'},
				'100':{transform: 'none'}
			},
			'bounceOut':{
				'0':{transform: 'scale3d(.9, .9, .9)'},
				'50,55':{transform: 'scale3d(1.1, 1.1, 1.1)'},
				'100':{opacity: 0, transform: 'scale3d(.3, .3, .3)'}
			},			
			'bounceOutLeft':{
				'20':{opacity:1,transform: 'translate3d(20px, 0, 0)'},
				'100':{opacity: 0, transform: 'translate3d(-2000px, 0, 0)'}
			},			
			'bounceOutRight':{
				'20':{opacity:1,transform: 'translate3d(-20px, 0, 0)'},
				'100':{opacity: 0, transform: 'translate3d(2000px, 0, 0)'}
			},
			'fadeIn':{
			  '0': {opacity: 0},
			  '100': {opacity: 1}
			},
			'fadeOut':{
			  '0': {opacity: 1},
			  '100': {opacity: 0}
			},
			'flip':{
				'0':{transform: 'perspective(400px) rotate3d(0, 1, 0, -360deg)'},
				'40':{transform: 'perspective(400px) rotate3d(0, 1, 0, -190deg)'},
				'60':{transform: 'perspective(400px) rotate3d(0, 1, 0, -170deg)'},
				'80':{transform: 'perspective(400px) scale3d(.95, .95, .95)', 'animation-timing-function': 'ease-in'},
				'100':{transform: 'perspective(400px)', 'animation-timing-function': 'ease-in'}
			},
			'flipInX':{
				'0':{transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)'},
				'40':{transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)'},
				'60':{transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)'},
				'80':{transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)'},
				'100':{transform: 'perspective(400px)'}
			},
			'flipInY':{
				'0':{transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)'},
				'40':{transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)'},
				'60':{transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)'},
				'80':{transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)'},
				'100':{transform: 'perspective(400px)'}
			},
			'flipOutX':{
				'0':{transform: 'perspective(400px)'},
				'30':{transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', opacity: 1},
				'100':{transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: 0}	
			},
			'flipOutY':{
				'0':{transform: 'perspective(400px)'},
				'30':{transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)', opacity: 1},
				'100':{transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: 0}	
			},
			'rollIn':{
				'0':{transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)', opacity: 0},
				'100':{transform: 'none', opacity: 1}	
			},
			'rollOut':{
				'0':{transform: 'none', opacity: 1},
				'100':{transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)', opacity: 0}
			},
			'zoomIn':{
				'0':{transform: 'scale3d(.3, .3, .3)', opacity: 0},
				'50':{opacity: 1}
			},
			'zoomOut':{
				'0':{opacity: 1},
				'50':{transform: 'scale3d(.3, .3, .3)', opacity: 0},
				'100':{opacity: 0}
			}
		};


		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config){

			this.config = Zepto.extend({}, _static.config, config); // 参数接收

			/**
			 * @alias mo.Animation#
			 * @ignore
			 */
			var self = this;
			var config = self.config;

			/**
			 * 目标动画元素
			 * @type {Object}
			 */
			self.target = Zepto(config.target);

			/**
			 * 关键帧
			 * @type {Object}
			 */

			self.keyframes = {};
			if(config.effect) {
				Zepto.extend(self.keyframes, _private.effect[config.effect]);
			}
			if(config.keyframes) {
				Zepto.extend(self.keyframes, config.keyframes);
			}


			if(self.target.length < 1 || !self.keyframes) {
				return;
			}


			// event binding
			// self.effect && self.on(self.effect);
			config.event && self.on(config.event);

			self.percent = 0;

			self.__setup();

			// attach events
			self.__attach();

			if(config.autoPlay) {
				self.play();
			}
			
		};

		_public.__setup = function(){
			var self = this;
			var config = self.config;
			var prefix = '', eventPrefix,
		    vendors = {webkit: 'webkit', moz: '', O: 'o'},
		    testEl = document.createElement('div'),
		    // supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		    transform,
		    formatTime = function(n){return /^\d+$/.test(n) ? n + 'ms' : n.toString()};
		    

		    for(var key in vendors) {
				if (testEl.style[vendors[key] + 'Animation'] !== undefined) {
					prefix = '-' + key.toLowerCase() + '-';
					eventPrefix = key;
				}
		    }

		    _static.__prefix = prefix;
		    _static.__eventPrefix = eventPrefix;


			// create animate style
			var animateName = 'mo-' + parseInt(Math.random()*1000000);
			var cssText = '@' + prefix + 'keyframes ' + animateName + '{';
			for(var key in self.keyframes) {
				var css = '{';
				var obj = self.keyframes[key];
				for(var prop in obj) {
					var val = obj[prop];
					prop = prop.replace(/([A-Z])/g, function(a,b){return '-' + b.toLowerCase()});
					prop = prop.replace(/easing/g, 'animation-timing');
					prop = prop.replace(/^(?=transform|perspective|transition|animation)/g, prefix);
					css += prop + ':' + val + ';';
				}
				css += '}'
				key = key.replace(/%/g, '');
				key = key.split(',');
				for(var i = 0; i < key.length; i++) {
					cssText += key[i] + '%';
					cssText += css;
				}

			}
			cssText += '}';
			styleElem.appendChild(document.createTextNode(cssText));

			// apply animate
		    var style = self.animationStyle = {};
			if(config.apply) style[prefix + 'animation-name'] = animateName;
			style[prefix + 'animation-duration'] = formatTime(config.duration);
			style[prefix + 'animation-timing-function'] = config.easing;
			style[prefix + 'animation-delay'] = formatTime(config.delay);
			style[prefix + 'animation-direction'] = config.direction;
			style[prefix + 'animation-fill-mode'] = config.fillMode;
			style[prefix + 'animation-play-state'] = config.autoPlay ? 'running' : 'paused';
			style[prefix + 'animation-iteration-count'] = config.iteration.toString();
			self.target.css(style);

			self.animateName = animateName;
			self.target.data('animation-name', animateName);

			self.target.addClass('mo-animation');

		}

		_public.__attach = function(){
			var self = this;
			var config = self.config;


			self.target[0].addEventListener(_static.__eventPrefix + 'AnimationStart', function(e){
				if(e.target == self.target[0]) {
					self.__startTime = new Date();
					self.__runtime = 0;
					window.clearInterval(self.__timer);
					self.__timer = window.setInterval(function(){
				// console.log(self.target[0].className);
				// console.log( self);
						if(self.playing) {
							if(config.iteration === 1) {
								var now = new Date();
								self.__runtime += now - self.__startTime;
								self.__startTime = new Date();
								self.percent =  Math.round(self.__runtime * 100/config.duration);
								self.percent = self.percent > 100 ? 100 : self.percent;
							}
							/**
							 * @event mo.Animation#running: 动画播放时
							 * @property {object} event 事件对象
							 */
							self.trigger('running');

						}
					}, 20);

					/**
					 * @event mo.Animation#start: 动画开始时
					 * @property {object} event 事件对象
					 */
					self.trigger('start');
				}
			});
			self.target[0].addEventListener(_static.__eventPrefix + 'AnimationIteration', function(e){
				if(e.target == self.target[0]) {
					/**
					 * @event mo.Animation#iteration: 动画重复时
					 * @property {object} event 事件对象
					 */	
					self.trigger('iteration')
				}
			});
			self.target[0].addEventListener(_static.__eventPrefix + 'AnimationEnd', function(e){
				if(e.target == self.target[0]) {
					self.percent = 100;
					self.trigger('running');

					/**
					 * @event mo.Animation#end: 动画结束时
					 * @property {object} event 事件对象
					 */	
					self.trigger('end');
					window.clearInterval(self.__timer);			
				}		
			});
		};


		/**
		 * 播放动画
		 */
		_public.play = function(self){

			this.playing = true;
			this.__startTime = new Date();
			this.target.css(_static.__prefix + 'animation-play-state', 'running');

		};

		_public.getState = function(){
			return this.target.css(_static.__prefix + 'animation-play-state');
		};

		/**
		 * 重新播放动画
		 */		
		_public.rePlay = function(){
			this.__setup();
		};

		/**
		 * 暂停动画播放
		 */
		_public.stop = function(){
			/**
			 * 动画是否正在播放
			 * @type {boolean}
			 */
			this.playing = false;
			this.target.css(_static.__prefix + 'animation-play-state', 'paused');
		};

		/**
		 * 应用动画
		 */
		_public.apply = function(){
			this.target.css(_static.__prefix + 'animation-name', this.animateName);
		};

		/**
		 * 撤消动画
		 */
		_public.revoke = function(){
			this.target.css(_static.__prefix + 'animation-name', '');
		};

		/**
		 * 通过class自动触发动画
		 */
		_static.parse = function(context){
			var container = Zepto(document);
			if(context) {
				container = Zepto(context);
			}
			var animElems = container.find('.mo-animation');
			animElems.each(function(i, elem){
				elem = Zepto(elem);
				var pars = {
					target: elem
				};
				for(var prop in _static.config) {
					var val = elem.data(prop);
					
					if(val !== null) {
						pars[prop] = val;
					}
					
				}
				new mo.Animation(pars);
			});
		}


		/**
		 * 应用动画
		 */
		_static.apply = function(context){
			var container = Zepto(document);
			if(context) {
				container = Zepto(context);
			}
			var animElems = container.find('.mo-animation');
			animElems.each(function(i, elem){
				elem = Zepto(elem);
				elem.css(_static.__prefix + 'animation-name', elem.data('animation-name'));
				console.log(_static.__prefix + 'animation-name', elem.data('animation-name'));
			});
		};

		/**
		 * 撤消动画
		 */
		_static.revoke = function(context){
			var container = Zepto(document);
			if(context) {
				container = Zepto(context);
			}
			var animElems = container.find('.mo-animation');
			animElems.css(_static.__prefix + 'animation-name', '');
		};





	});

});
