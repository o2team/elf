/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 页面滑动类，已停止更新，统一使用 Slide类
 * @extends mo.Tab
 * @name mo.PageSlide
 * @requires lib/zepto.js
 * @requires src/base.js
 * @requires src/tab.js
 * @param {boolean}  [config.touchMove=true] 是否允许手指滑动
  * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
 * @param {object|string} [config.controller='ul>li*'] 触发器
 * @param {string} [config.effect='slide'] 指定效果，可选值：'slide', 'roll', 'scale'
 * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
 * @param {boolean}  [config.autoPlay=false] 是否自动播放 
 * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式） 
 * @param {string}  [config.type='mouseover'] 事件触发类型
 * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
 * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
 * @param {number}  [config.stay=2000] 自动播放时停留时间
 * @param {boolean}  [config.loop=false] 是否启用循环滚动
 * @param {number}  [config.delay=150] mouseover触发延迟时间
 * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
 * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
 * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
 * @param {object{string:function}}  [config.event] 初始化绑定的事件
 * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
 * @param {boolean}  [config.lazy=false] 是否启用按需加载
 * @example
		var tab1 = new mo.PageSlide({
			target: $('#slide01 li')
		});
 * @see page-slide/demo2.html 垂直单屏滑动
 * @see page-slide/demo3.html 垂直缩放滑动
 * @class
*/
define(function(require, exports, module) {
	require('../tab/tab.js');
	Motion.add('mo.PageSlide:mo.Tab', function() {
		/**
		 * public 作用域
		 * @alias mo.PageSlide#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.PageSlide.
		 * @ignore
		 */
		var _static = this.constructor;



		_public.init = function(config) {
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			
			// 初始化父类
			this.superClass.call(this, this.config);
		};

		_static.config = {
			touchMove: true,
			direction: 'y',
			effect: 'slide',
			controller: false
		};

		mo.Tab.extend('slide', {
			init: function() {
				var self = this;
				var config = self.config;

				// 清除浮动
				self.container.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				self.container.css('-webkit-backface-visibility', 'hidden');


				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {

					// 初始化CSS
					self.target.css('float', 'left');

					var wrapWidth = 0;
					self.target.each(function(i, elem) {
						wrapWidth += Zepto(elem)[0].offsetWidth;
					});
					if (wrapWidth <= 0) {
						wrapWidth = document.documentElement.offsetWidth * self.target.length;
					}

					self.wrap.css('width', config.wrapWidth || wrapWidth + 'px');

					// 设置操作属性
					self.animProp = 'translateX'; 
					self.offsetProp = 'offsetLeft';
				} else {
					self.animProp = 'translateY'; 
					self.offsetProp = 'offsetTop';
				}
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				if(self.moving == true) {
					return;
				}


				var o = {};
				var currentVal = /\(([\d-]*).*\)/.exec(self.wrap.css(self.propPrefix + 'Transform'));
				var currentPos = currentVal ? currentVal[1]*1 : 0;
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (currentPos + moveDis)  + 'px)';


				self.wrap.css(o, 0);

				
			},

			touchend: function(e, dis){
				var self = this;

				// 如果有单屏页面内容过多
				var rect = self.target[self.curPage].getBoundingClientRect();
				var winHeight = window.innerHeight;
				if( (dis < 0 && rect.bottom > winHeight) || (dis > 0 && rect.top < 0)) {
					return false;
				}	
			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var from = self.prevPage === window.undefined ? 0 : self.prevPage;
				var to = self.curPage;
				var pos;
				var o = {};
				var animObj;

				o[self.animProp] = -self.target[to][self.offsetProp] + 'px';

				self.moving = true;
				self.wrap.animate(o, config.animateTime, config.easing, function() {
					self.moving = false;
					self.trigger('change', [self.curPage]);
				});
			}


		});


		mo.Tab.extend('roll', {
			init: function() {
				var self = this;
				var config = self.config;
				var cssPrefix = self.cssPrefix;
				var offset = self.wrap.offset();
				var size  = config.direction == 'x' ? offset.width : offset.height;
				var rotateFn = config.direction == 'x'  ? 'rotateY' : 'rotateX';
				var theta = 360 / self.target.length;
				var radius  = Math.round(  size / 2 / Math.tan( Math.PI / self.target.length ) );

				self.theta = theta;
				self.radius = radius;
				self.rotateFn = rotateFn;

				self.container.css(cssPrefix + 'perspective', 200 +'px');
				self.container.css(cssPrefix + 'backface-visibility', 'hidden');

				var wrapCss = {'position': 'relative'};
				wrapCss[cssPrefix + 'transform-style'] =  'preserve-3d';
				wrapCss[cssPrefix + 'transform'] = 'translateZ(-'+ radius  +'px)';
				wrapCss[cssPrefix + 'transform-origin'] = '50% 50% -'+ radius +'px';
				self.wrap.css(wrapCss);


				for(var i = 0; i < self.target.length; i++) {
					var targetCss = {
						'position': 'absolute',
						'left': 0,
						'top': 0
					};
					targetCss[cssPrefix + 'transform'] = rotateFn +'(-'+ i*360/self.target.length +'deg) translateZ('+ radius  +'px)';
					self.target.eq(i).css(targetCss);
				}
			},

			touchmove: function(e, startDis, moveDis){
				var self = this;
				if(self.moving == true) {
					return;
				}

				var angle = self.curPage * self.theta - startDis/5;
				// console.log(angle, startDis);

				self.wrap.css(self.cssPrefix + 'transform', self.rotateFn + '('+ angle +'deg) translateZ(-'+ self.radius  +'px)');

				e.preventDefault();
			},

			touchend: function(e, dis){

			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var angle = self.curPage * self.theta;
				var o = {};
				o[self.cssPrefix + 'transform'] = self.rotateFn  + '('+ angle +'deg) translateZ(-'+ self.radius  +'px)';
				
				self.moving = true;
				self.wrap.animate(o, config.animateTime, config.easing, function() {
					self.moving = false;
					self.trigger('change', [self.curPage]);
				});
			},

			change: function(){

				// console.log(0)
			}


		});





		mo.Tab.extend('scale', {
			init: function() {
				var self = this;
				var config = self.config;
				var cssPrefix = self.cssPrefix;
				var offset = self.wrap.offset();
				var size  = config.direction == 'x' ? offset.width : offset.height;
				var rotateFn = config.direction == 'x'  ? 'rotateY' : 'rotateX';
				var theta = 360 / self.target.length;
				var radius  = Math.round(  size / 2 / Math.tan( Math.PI / self.target.length ) );

				self.wrap.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				// self.container.css(cssPrefix + 'backface-visibility', 'hidden');


				self.target.each(function(i, obj){
					obj = Zepto(obj);
					var o = {};
					// o[self.cssPrefix + 'transform'] = 'scaleX(0.5) scaleY(0.5)';
					// obj.css(o);
				});



				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {

					// 设置操作属性
					self.animProp = 'translateX'; 
					self.offsetProp = 'offsetLeft';
				} else {
					self.animProp = 'translateY'; 
					self.offsetProp = 'offsetTop';
				}
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				if(self.moving == true) {
					return;
				}

				var o = {};
				var currentObj = self.target.eq(self.curPage);
				var currentVal = /\(([\d-]*).*\)/.exec(self.wrap.css(self.propPrefix + 'Transform'));
				var currentPos = currentVal ? currentVal[1]*1 : 0;
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (currentPos + moveDis)  + 'px)';

				if(startDis >0 ) {
					currentObj.css(self.cssPrefix + 'transform-origin', '50% 0%');
				} else {
					currentObj.css(self.cssPrefix + 'transform-origin', '50% 100%');
				}

				self.wrap.css(o, 0);

				var scale = 1-Math.abs(startDis/Zepto(window).height());



				e.preventDefault();

				var prevObjProp = {};
				prevObjProp[self.cssPrefix + 'transform'] = 'scaleX('+ scale +') scaleY('+ scale +')';
				currentObj.css(prevObjProp);




			},

			touchend: function(e, dis){

			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var obj = self.target.eq(self.curPage);
				var prevObj = self.prevPage === window.undefined ? null : self.target.eq(self.prevPage);

				var wrapProp = {};
				wrapProp[self.cssPrefix + 'transform'] = 'translateY(-' + obj[0].offsetTop + 'px)';


				// obj.css(self.cssPrefix + 'transform', 'scaleX(0.2) scaleY(0.2)');


				if(prevObj) {
					var prevObjProp = {};
					prevObjProp[self.cssPrefix + 'transform'] = 'scaleX(0.2) scaleY(0.2)';
					prevObjProp[self.cssPrefix + 'backface-visibility'] = 'hidden';
					prevObj.animate(prevObjProp, config.animateTime, config.easing, function() {
						prevObj.css(self.cssPrefix + 'transform', 'scaleX(1) scaleY(1)');
					});
				}

				var objProp = {};
				objProp[self.cssPrefix + 'transform'] = 'scaleX(1) scaleY(1)';
				objProp[self.cssPrefix + 'backface-visibility'] = 'hidden';
				obj.animate(objProp, config.animateTime, config.easing, function() {
					// self.trigger('change');
				});


				self.moving = true;
				
				self.wrap.animate(wrapProp, config.animateTime, config.easing, function() {
					self.moving = false;

					self.trigger('change', [self.curPage]);
				});


			},

			change: function(){

				// console.log(0)
			}


		});




		mo.Tab.extend('xx', {
			init: function() {
				var self = this;
				var config = self.config;
				var wrapOffset = self.wrap.offset();

				// 初始化样式
				self.wrap.css({
					'position': 'relative',
					'overflow': 'hidden'
				});
				self.target.css({
					'position': 'absolute'
				});

				// 设置不同方向不同的操作属性
				if (config.direction == 'x') {
					self.animProp = 'translateX'; 
					self.offset = wrapOffset.width;
				} else {
					self.animProp = 'translateY'; 
					self.offset = wrapOffset.height;
				}

				// 往上翻移动层级
				self._launch = function(obj){
					self.target.css('zIndex', '1');
					var o = {};
					o[self.cssPrefix + 'transform'] = self.animProp + '(' + obj.data('oriPos') + 'px)';
					o.zIndex = '3';
					obj.css(o);
					obj.data('hasReady', true);
					
				};
			},


			touchmove: function(e, startDis, moveDis){
				var self = this;
				var targetObj;
				var plus;
				if(self.moving == true) {
					return;
				}

				if(self._targetObj === window.undefined) {
					var targetPage;
					var oriPos;
					if(startDis < 0) {
						targetPage = self._outBound(self.curPage + 1);
						oriPos =  self.offset;
					} else {
						targetPage = self._outBound(self.curPage - 1);
						oriPos = -self.offset;
					}
					self._targetObj = self.target.eq(targetPage);
					self._targetObj.data('oriPos', oriPos);
					self._launch(self._targetObj);[
					]
					self.target.eq(self.curPage).css('zIndex', '2');
				}

				var o = {};
				o[self.cssPrefix + 'transform'] = self.animProp + '(' + (startDis + self._targetObj.data('oriPos')) + 'px)';
				self._targetObj.css(o);
			},

			touchend: function(e, dis){
				var self = this;
				var config = self.config;
				// 回到本页
				if(Math.abs(dis) < self.config.touchDis) {console.log(self._targetObj);
					var o = {};
					o[self.animProp] =   '0px';
					self._targetObj.animate(o, config.animateTime, config.easing, function(){
						self.moving = false;
						self._targetObj.data('hasReady', false);

						delete self._targetObj;
					});
				} 

			},

			beforechange: function() {
				var self = this;
				var config = self.config;
				var pos;
				var o = {};
				var animObj;


				if(self._targetObj === window.undefined) {
					var oriPos;
					if( (self.prevPage !== window.undefined) && (self.curPage < self.prevPage)) {
						oriPos = -self.offset;
					} else {
						oriPos =  self.offset;
					}
					self._targetObj = self.target.eq(self.curPage);
					self._targetObj.data('oriPos', oriPos);
					self._launch(self._targetObj);
					self.target.eq(self.prevPage).css('zIndex', '2');
				}



				o[self.animProp] =   '0px';
				// console.log(self.curPage);

				self._targetObj.animate(o, config.animateTime, config.easing, function() {
					self.moving = false;
					self._targetObj.data('hasReady', false);
					delete self._targetObj;
					self.trigger('change', [self.curPage]);
				});

	


			},

			change: function(){

			}


		});






	});

});