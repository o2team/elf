/**
 * @author Aidenxiong
 * @version 1.0
 * @date 2014-08-20
 * @description 图片帧（逐帧）动画控制，支持sprite图及序列图片两种方式
 * @extends mo.Base
 * @name mo.Film
 * @requires ../../resource/zepto/zepto.js
 * @param {HTMLElement} node 帧动画播放的节点
 * @param {object} [config] 帧动画配置参数
 * @param {array|string} config.resource 帧资源图片，可以是数组也可以是单张图片，单张图片会被认为是sprite图
 * @param {number} [config.totalFrame=10] 总帧数
 * @param {number} [config.spriteDirect=0] 使用sprite图片的时候，可以指明sprite平铺方向  1为横向  2为纵向    如果值为0   那么根据长宽比进行判断
 * @param {number} [config.index=0] 默认显示第几帧
 * @param {number} [config.playTime=1000] 滚动执行时间
 * @param {string} [config.aniType=linear] 运算轨迹
 * @param {function} [config.onLoading] 资源加载时的回调
 * @param {function} [config.onComplete] 资源加载完成后的回调
 * @param {function}  [config.onPlaying] 每次完成一张图片切换时的回调 
 * @param {function}  [config.aniComplete] 每次自动完成一次动画播放后的回调 
 * @example
		var film = new mo.Film(document.getElementById('test'), {
			resource: []
		});
 * @see film/multiple.htm 多图形式
 * @see film/sprite.htm 雪碧图形式
 * @class
*/

define(function(require, exports, module){
	require('../motion/motion.js');
	require('../base/base.js');
	Motion.add('mo.Film:mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Film#
		 * @ignore
		 */
		var _public = this;

		var _private = {
		/**
			 * 空函数  什么也不干
			 * @return {[type]} [description]
			 */
			empty : function(){},
			/**
			 * 单张图片加载
			 * @param  {String}   src 图片地址
			 * @param  {Function} cb  加载完成后的回调
			 * @return {undefined}
			 */
			imgSingleLoader : function(src, cb){
				var img = new Image();
				img.onload = function(){
					cb({
						width : img.width,
						height : img.height
					});
					img.onload = null;
				}
				img.src = src;
			},
			/**
			 * 批量图片加载
			 * @param  {Array|String} res            资源地址
			 * @param  {Function}     singleComplete 单个资源加载完成的回调
			 * @param  {Function}     allComplete    所有资源加载完成后的回调
			 * @return {undefined}
			 */
			resLoader : function(res, singleComplete, allComplete){
				var len = res.length, count = 0;
				$.each(res, function(index, item){
					_private.imgSingleLoader(item, function(size){
						singleComplete(++count, len, size);
						if(count == len){
							allComplete(size);
						}
					})
				});
			},
			/**
			 * RequestAnimationFrame兼容写法
			 * @return {Object} cancel和request方法
			 */
			animation : function(){
				var lastTime = 0;
				var vendors = ['ms', 'moz', 'webkit', 'o'];
				var request, cancel;
				for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					request = window[vendors[x]+'RequestAnimationFrame'];
					cancel = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
				}

				if (!request) {
					request = function(callback, element) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function() { 
							callback(currTime + timeToCall); 
						},timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};
				}

				if (!cancel) {
					cancel = function(id) {
						clearTimeout(id);
					};
				}

				return {
					"request" : request,
					"cancel" : cancel
				}
			}(),
			/**
			 * 动画类型
			 * @type {Object}
			 */
			aniType : {
				'linear' : function(t,b,c,d){ return c*t/d + b; },
				'easeIn': function(t,b,c,d){
					return c*(t/=d)*t + b;
				},
				'easeOut': function(t,b,c,d){
					return -c *(t/=d)*(t-2) + b;
				},
				'easeInOut': function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t + b;
					return -c/2 * ((--t)*(t-2) - 1) + b;
				}
			},
			/**
			 * dom指定唯一标识
			 * @return {String} 唯一标识
			 */
			uniqueID : (function(){
				var _loadTime = (new Date()).getTime().toString(), _i = 1;
				var getUniqueKey = function(){
					return _loadTime + (_i++);
				}
				return function(dom){
					return dom && (dom.uniqueID || (dom.uniqueID = getUniqueKey()));
				}
				
			})()
		}
		/**
		 * public static作用域
		 * @alias mo.Film.
		 * @ignore
		 */
		var _static = this.constructor;


		// 插件默认配置
		_static.config = {
			resource : [],  //如果传递的为一张图片，那么认为是采用sprite的形式进行
			totalFrame : 10,  //帧数
			spriteDirect : 0, //使用sprite图片的时候，可以指明sprite平铺方向  1为横向  2为纵向    如果值为0   那么根据长宽比进行判断
			index : 0, //默认显示第几帧
			playTime : 1000, //滚动执行事件
			aniType : 'linear', //运算轨迹
			onLoading : _private.empty, //资源加载时的回调
			onComplete : _private.empty,  //资源加载完成后的回调
			onPlaying : _private.empty,  //每次完成一张图片切换时的回调
			aniComplete : _private.empty //每次自动完成一次动画播放后的回调
		};

		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(node, config) {
			if (!node) {
				return;
			}
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			var _config = this.config;
			var _self = this;

			//属性处理
			Zepto.extend(_self, /** @lends mo.Film.prototype*/ {
				/**
				 * 需要加载的资源
				 * @type {Array}
				 */
				resource: [].concat(_config.resource),
				/**
				 * 当前停留在的帧序号
				 * @type {Number}
				 */
				curIndex : 0,
				/**
				 * 是否正在加载
				 * @type {Boolean}
				 */
				isLoading : true,
				/**
				 * 帧数
				 * @type {Number}
				 */
				totalFrame : _config.totalFrame,
				/**
				 * 帧动画的尺寸(宽高)
				 * @type {Object}
				 */
				filmSize : {},
				/**
				 * 真正执行帧动画的节点
				 * @type {[type]}
				 */
				filmNode : node,
				/**
				 * 每帧对应的样式/src
				 * @type {Array}
				 */
				frameStyles : [],
				/**
				 * 播放动画ID
				 * @type {[type]}
				 */
				animationId : null
			});
			//资源预加载
			_private.resLoader(_self.resource, _config.onLoading, function(size){
				_self.isLoading = false;

				var _totalFrame = _self.totalFrame, _contSize = _self.filmSize, _frameStyles = _self.frameStyles;
				//雪碧图形式 资源数量为1
				if(_self.resource.length == 1){
					//横向
					var lateral = function(){
						_contSize.width = size.width/_totalFrame;
						_contSize.height = size.height;
						for (var i = 0; i < _totalFrame; i++) {
							_frameStyles.push("url(" + _self.resource[0] + ") -" + (_contSize.width*i) + "px 0 no-repeat;");
						};
					}
					//纵向
					var portrait = function(){
						_contSize.width = size.width;
						_contSize.height = size.height/_totalFrame;
						for (var i = 0; i < _totalFrame; i++) {
							_frameStyles.push("url(" + _self.resource[0] + ") 0 -" + (_contSize.height*i) + "px no-repeat;")
						};
					}
					if(config.spriteDirect == 1){ //横向
						lateral();
					}else if(config.spriteDirect == 2){ //纵向
						portrait();
					}else{
						size.width > size.height ? lateral() : portrait();
					}
				}else{  //如果资源数超过两个，那么配置参数中的totalFrame不起作用，已实际传入的资源数为准
					_totalFrame = _self.totalFrame = _self.resource.length;
					_self.filmSize = size;

					_self.filmNode = document.createElement('img');
					node.appendChild(_self.filmNode);
					for (var i = 0; i < _totalFrame; i++) {
						_frameStyles.push(_self.resource[i]);
					};
				}
				_config.onComplete(size);
				_self.jumpTo(_config.index);
			});
		}

		/**
		 * 参数格式化
		 * @param  {[type]} opt [description]
		 * @return {[type]}     [description]
		 */
		_private.formatOpt = function(config, opt){
			var tempObj = {}
			if(typeof opt == 'string'){
				opt = {
					'direction' : opt
				};
			}
			tempObj = Zepto.extend(true, {}, config, opt);
			tempObj.direction = tempObj.direction == 'backward' ? 'backward' : 'forward';
			return tempObj
		}

		/**
		 * @function jumpTo
		 * @description 跳转至的帧数
		 * @param  {[type]} index 需要跳转到的帧数
		 * @return {Object}       film对象
		 */
		_public.jumpTo = function(index){
			var _self = this;
			if(_self.isLoading) return;

			if(index < 0){  //负数的情况从后面往前数
				index = index - Math.floor(index/_self.totalFrame) * _self.totalFrame;
			}else{
				index = index % _self.totalFrame;
			}
			if(_self.resource.length == 1){
				Zepto(_self.filmNode).css({
					width : _self.filmSize.width,
					height : _self.filmSize.height,
					background : _self.frameStyles[index]
				})
			}else{
				_self.filmNode.src = _self.frameStyles[index];
			}
			_self.curIndex = index;
			_self.config.onPlaying(_self.curIndex);
			return _self;
		}
		/**
		 * 跳转到下一帧
		 * @return {object} film对象
		 */
		_public.next = function(){
			var _self = this;
			_self.jumpTo(_self.curIndex + 1);
			return _self;
		};
		/**
		 * 跳转到上一帧
		 * @return {object} film对象
		 */
		_public.prev = function(){
			var _self = this;
			_self.jumpTo(_self.curIndex - 1);
			return _self;
		};
		/**
		 * 通过告诉停留在第几个位置上来定位滑动位置
		 * @param  {Number} index 需要播放到的位置
		 * @param  {String} opt   播放的方向   向前：forward  向后：backward
		 * @return {object} film对象
		 */
		_public.playByIndex = function(index, opt){
			var _self = this;
			opt = _private.formatOpt(_self.config, opt);
			var playNum = 0;
			index = index % _self.totalFrame;
			if((opt.direction == 'forward' && _self.curIndex >= index) || (opt.direction == 'backward' && _self.curIndex <= index)){
				playNum = _self.totalFrame - _self.curIndex + index;
			}else{
				playNum = index - _self.curIndex;
			}
			_self.playByNum(playNum, opt);
			return _self;
		};
		/**
		 * 通过规定播放的帧数来滑动
		 * @param  {Number} num 需要播放的帧数
		 * @param  {String} opt 播放的方向   向前：forward  向后：backward
		 * @return {object} film对象
		 */
		_public.playByNum = function(num, opt){
			var _self = this;
			_self.aid && _self.pause();
			opt = _private.formatOpt(_self.config, opt);
			var startTime = new Date().getTime();
			var endTime = startTime + opt.playTime;
			var aniFunc = typeof opt.aniType == 'function' ? opt.aniType : (_private.aniType[opt.aniType] || _private.aniType['linear']);
			var hasPlayedNum = 0, nextPlayTime = aniFunc(hasPlayedNum + 1, startTime, opt.playTime, num);
			(function loop(cTime){
				if(cTime >= nextPlayTime){
					hasPlayedNum++;
					nextPlayTime = aniFunc(hasPlayedNum + 1, startTime, opt.playTime, num);
					opt.direction == 'forward' ? _self.next() : _self.prev();
				}
				if(cTime <= endTime){
					_self.aid = _private.animation.request(loop);
				}else{
					_self.aid = null;
					opt.aniComplete(_self.curIndex);
				}
			})(startTime);
			return _self;
		}
		/**
		 * 播放帧动画
		 * @param  {number} t   每帧之间的时间间隔
		 * @param  {[type]} dir 播放方向 支持forward和backward
		 * @return {object} film对象
		 */
		_public.play = function(t, dir){
			dir = dir || 'forward';
			var _self = this;
			_self.aid && _self.pause();
			var startTime = new Date().getTime(), lastTime = startTime;
			(function loop(cTime){
				_self.aid = _private.animation.request(loop);
				if(cTime > lastTime + t){
					lastTime = cTime;
					dir == 'forward' ? _self.next() : _self.prev();
				}
			})(startTime);
			return _self;
		}
		/**
		 * 暂停播放
		 * @return {object} film对象
		 */
		_public.pause = function(){
			var _self = this;
			_private.animation.cancel(_self.aid);
			_self.aid = null;
			return _self;
		}
		
	})
});