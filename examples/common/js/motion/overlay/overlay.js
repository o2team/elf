/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-10-02
 * @description 基础浮层类，没有关闭按钮，没有操作按钮，可应用于操作提示，loading等场景。
 * @extends mo.Base
 * @name mo.Overlay
 * @requires lib/zepto.js
 * @requires src/base.js
 * @param {boolean} [config.mask=true] 是否有蒙板
 * @param {boolean} [config.autoOpen=true] 是否自动打开对话框
 * @param {array} [ config.pos='middle'] 设置overlay打开位置，可选值：'middle', 'top', 'bottom'
 * @param {string} [config.className='pop***'] 自定义class方便控制样式
 * @param {boolean} [config.effect=true] 是否启用过渡效果
 * @param {boolean} [config.hasFoot=false] 是否有底部
 * @param {object} [config.start= {'opacity': 0,'transform': 'rotateX(-90deg)','transform-origin': '50% 0'}] 打开弹窗时起始状态
 * @param {object} [config.end={'opacity': 1,'transform': 'rotateX(0)','transform-origin': '50% 0'}] 打开弹窗时结束状态
 * @param {number} [config.duration=800] 动画时间，可设为0关闭动画
 * @param {string|element|URLString} [config.content=''] overlay内容
 * @param {string|number} [config.width='300'] overlay宽度
 * @param {string|number} [config.height='auto'] overlay高度
 * @param {string} [config.tpl='$_private.tpl'] 弹窗模板
 * @example
		var overlay1 = new mo.Overlay('数据提交成功！');
 * @see overlay/demo1.html 普通浮层
 * @see overlay/demo2.html 自定义效果
 * @see overlay/demo3.html 自定义位置
 * @class
*/
define(function(require, exports, module) {
	require('../base/base.js');
	require('./overlay.css');

	Motion.add('mo.Overlay:mo.Base', function() {

		/**
		 * public 作用域
		 * @alias mo.Overlay#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Overlay.
		 * @ignore
		 */
		// var _static = arguments.callee;
		var _static = this.constructor;

		var win = window.top;
		var doc = Zepto(win.document);
		

		win = Zepto(win);		

		// 查找模板中相应元素的标识
		_private.CLOSE = 'mo-pop-close';
		_private.BODY = 'mo-pop-body';
		_private.FOOT = 'mo-pop-foot';

		// 模板
		_private.tpl = '\
			<div class="mo-pop">\
				<button class="mo-pop-close" type="button" title="关闭弹出层">关闭</button>\
				<div class="mo-pop-body"></div>\
				<div class="mo-pop-foot"></div>\
			</div>';
		

		// 插件默认配置
		_static.config = {
			mask: true, // 是否有蒙板
			autoOpen: true, // 是否自动打开overlay
			hasClose: false, // 是否有关闭按钮
			hasFoot: false, // 是否有底部
			effect: true, // 是否启用过渡效果
			offset:[0, 0], // 设置位置偏移
			valign: 'middle', // 设置overlay坐标
			className: 'pop' + parseInt(1000*Math.random()), // 自定义class方便控制样式
			// destroy: true, // 关闭后是否将DOM移除
			//bind: //绑定某个元素


			// 设置初始状态
			start: {
				'opacity': 0,
				// 'transform': 'rotateX(90deg)',
				'-webkit-transform': 'rotateX(-90deg)',
				'-webkit-transform-origin': '50% 0'
			},

			// 设置结束状态
			end: {
				'opacity': 1,
				// 'transform': 'rotateX(0)'
				'-webkit-transform': 'rotateX(0)',
				'-webkit-transform-origin': '50% 0'
			},

			duration : 200,
			easing: 'linear',
			
			content: '', // overlay内容

			width: 300,
			height: 'auto',
			
			tpl: _private.tpl
		};


		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config){
			if(typeof config == 'string') {
				config = {content: config};
			}
			this.config = Zepto.extend({}, _static.config, config); // 参数接收

			var self = this;
			var config = self.config;

			// 参数处理
				// 如果弹窗位置是follow某元素
				// if(!Zepto.isArray(config.pos)){
				// 	var followElem = Zepto(config.pos);
				// 	if(followElem.length > 0) {
				// 		config.pos = followElem;
				// 		config.follow = true;
				// 	} else {
				// 		config.pos = _static.config.pos;
				// 	}
				// }

			// 自定义事件绑定
			self.event && self.on(self.event);
			config.event && self.on(config.event);


			// 创建结构
			_private.create.call(self);


			// 填充内容
			_private.fill.call(self);
	
			// 绑定事件
			_private.attach.call(self);

			// 设置样式获取样式
			_private.render.call(self);


			/**
			 * @event mo.Overlay#init
			 * @property {object} event 开始初始化
			 */
			self.trigger('init'); 

			if(self.config.autoOpen) {
				window.setTimeout(function(){
					self.open();
				}, 0);
			}

		};

		// 创建结构
		_private.create = function(){
			var body = doc.find('body');
			/**
			 * @alias mo.Overlay#
			 * @ignore
			 */
			var self = this;

			var config = self.config;

			// 是否为页面中特制模板
			var isCustom = Zepto.type(self.config.tpl) !== 'string';

			// 创建overlay
			/**
			 * 存储弹窗dom引用(dom.box, dom.head, dom.body, dom.foot. dom.close, dom.mask)
			 * @type {Object}
			 */
			self.dom = {} // 存储弹窗dom引用


			// 创建wrap
			self.dom.wrap = Zepto('<div class="mo-pop-wrap"></div>').prependTo(body);

			self.dom.wrap.css({
				'display': 'block',
				'position': 'fixed',
				'top': 0,
				'left': 0,
				'pointer-events': 'none',
				'width': win.width() + 'px',
				'height': win.height() + 'px',
				'overflow': 'hidden',
				'perspective': '1000px',
				'-webkit-perspective': '1000px',
				'-webkit-backface-visibility': 'hidden;'
			});


			// 添加蒙板
			self.dom.mask = Zepto('<div class="mo-pop-mask"></div>').prependTo(self.dom.wrap);
			self.dom.mask.css({
				'display': 'none',
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'width': '100%',
				'height': '9999px',
				'background': '#000',
				'opacity': 0.5,
				'pointer-events': 'auto',
				'zIndex': 999
			});

			self.dom.box = Zepto(self.config.tpl).clone().prependTo(self.dom.wrap);
			self.dom.box.addClass(config.className);

			// for 屏幕阅读器
			self.dom.box.attr('role', 'dialog');
			self.dom.box.attr('aria-label', config.title);

			self.dom.head = self.dom.box.find('.' + _private.HEAD);
			self.dom.close = self.dom.box.find('.' + _private.CLOSE);
			self.dom.body = self.dom.box.find('.' + _private.BODY);
			self.dom.foot = self.dom.box.find('.' + _private.FOOT);

			// 检测前缀
			self.cssPrefix = '';
			self.propPrefix = '';
			var vendors = {'webkit': 'webkit', 'Moz': 'moz', 'ms': 'ms'};
			var testElem = document.createElement('div');
			for(var key in vendors) {
				if (testElem.style[key + 'Transform'] !== undefined) {
					self.cssPrefix = '-' + vendors[key] + '-';
					self.propPrefix = key;
					break;
				}
			}

		};

		// 填充overlay内容
		_private.fill = function(){
			var self = this;
			var config = self.config;

			_private.fillHead.call(self, config.title); 
			_private.fillBody.call(self, config.content); 
			// _private.fillFoot.call(self, config.buttons); 
		};

		// 填充头部
		_private.fillHead = function(title){
			var config = this.config;
			var tpl = this.dom.head.html();
			var html = '';

			if(tpl) {
				html = _static.parseTPL({'title': title}, tpl);
			}
			this.dom.head.html(html);
		}

		// 填充主体
		_private.fillBody = function(content){
			var self = this;
			var config = self.config;

			// 判断内容类型
			var regURL = /^http:\/\/[\w-./?%&=\u4e00-\u9fa5]+$/i; //非严格检测
			var contentType = config.contentType;
			if(contentType === undefined && content !== '') {
				if(typeof content === 'object' && Zepto(content).length > 0) {
					contentType = 'element';
				} else if(typeof content === 'string') {
					contentType = regURL.test(content) ? 'url' : 'string';
				}
			}
			if(contentType === 'element'){
				Zepto(content).clone().appendTo(self.dom.body).show();
				return;
			}

			// 填充内容
			if(contentType === 'url') {
				content = '<iframe src="'+ content+'" frameborder="0" style="width:100%;height:100%;overflow:hidden;"></iframe>';
				self.dom.body.html(content);
			} else {
				self.dom.body.html(content);
			}

			self.contentType = contentType;

		};

		// 绑定事件
		_private.attach = function(){
			var self = this;
			var config = self.config;

			// 缩放窗口
			win.on('resize', function(){
				window.clearTimeout(self.resizeTimer);
				self.resizeTimer = window.setTimeout(function(){
					_private.updatePos.call(self);
					self.dom.box.css(self._startProp);
					if(self.opened) self.dom.box.css(self._endProp);
					self.dom.wrap.css({'width': win.width(), 'height': win.height()});
				}, 50);
			});

			// 关闭按钮
			self.dom.close.on('touchend', function(e){
				_public.close.call(self);
				e.stopPropagation();
			});

			self.dom.mask.on('touchmove', function(e){
				e.stopPropagation();
				e.preventDefault();
			});

			self.dom.box.on('touchmove', function(e){
				e.stopPropagation();
				e.preventDefault();
			});

			self.dom.mask.on('touchstart', function(){
				self.dom.box.css('opacity', 0.8);
			});			

			self.dom.mask.on('touchend', function(){
				self.dom.box.css('opacity', 1);
			});

		};


		// 计算pop开始与结束的位置
		_private.updatePos = function(){
			var self = this;
			var config = self.config;
			var startPos = {};
			var endPos = {}; 

			// 如果是绝对定位，则需要加上scrollTop && scrollLeft
			var leftPlus = 0, topPlus = 0;
			// if(!config.fixed) {
			// 	leftPlus = doc.scrollLeft();
			// 	topPlus = doc.scrollTop();
			// }

			// 如果是相对元素定位	
			if(config.follow === true) {
				var elemOffset = config.pos.offset();
				var iframeX = 0, iframeY = 0;
				if(window.frameElement) {
					var iframeOffset = Zepto(window.frameElement).offset();
					iframeX = iframeOffset.left;
					iframeY = iframeOffset.top;
				}
				endPos.left = elemOffset.left + iframeX;
				endPos.top = elemOffset.top + iframeY + config.pos.outerHeight();
			} 
			// 如果是相对页面定位
			else {
				startPos.left = endPos.left = (win.width() - self.dom.box[0].offsetWidth)/2;
				var boxHeight = self.dom.box[0].offsetHeight;
				switch (config.valign) { 
					case 'top':
						startPos.top = 0;
						endPos.top = 0;
						break; 
					case 'bottom':
						startPos.top = win.height();
						endPos.top = win.height() - boxHeight;
						break; 
					case 'middle':
						startPos.top = - boxHeight;
						endPos.top = (win.height() - boxHeight)/2;
						break; 
				} 
				startPos.left += leftPlus;
				startPos.top += topPlus;
				endPos.left += leftPlus;
				endPos.top += topPlus;
			}



			// 计算偏移值
			startPos.left += config.offset[0];
			startPos.top += config.offset[1];	
			endPos.left += config.offset[0];
			endPos.top += config.offset[1];	

			if(config.effect) {
				self._startProp = Zepto.extend({}, startPos, config.start);
				self._endProp = Zepto.extend({}, endPos, config.end);
				// console.dir(config.end);
				// self._startProp[self.cssPrefix + 'transform'] = 

			}

			

			
			//self.dom.box.css('left', 0)
		};


		/**
		 * 打开浮层
		 */
		_public.open = function(){

			var self = this;
			var config = self.config;

			self.dom.box.css('display', 'block');

			_private.updatePos.call(self);
			/**
			 * @event mo.Overlay#beforeopen:初始化完成
			 * @property {object} event 事件对象
			 */
			if(self.trigger('beforeopen') === false) {
				return;
			}

			window.setTimeout(function(){ 

				self.dom.box.animate(self._endProp, config.duration , config.easing , function(){
					/**
					 * @event mo.Overlay#open:关闭窗口时
					 * @property {object} event 事件对象
					 */
					self.trigger('open');
					

				});	
			},0);
			
			self.opened = true;
			if(self.opened && config.mask) {
				self.dom.mask.fadeIn(0);
			}
		};

		
		/**
		 * 关闭弹窗
		 */
		_public.close = function(){
			var self = this;
			var config = self.config;

			/**
			 * @event mo.Overlay#beforeclose:初始化完成
			 * @property {object} event 事件对象
			 */
			if(self.trigger('beforeclose') === false) {
				return;
			}

			// self.dom.box.css('border', 0);
			self.dom.box.animate(self._startProp, config.duration, config.easing, function(){			
				self.opened = false;
				self.dom.wrap.remove();

				/**
				 * @event mo.Overlay#close:关闭窗口时
				 * @property {object} event 事件对象
				 */
				self.trigger('close');
				

			});	
			
				

		};

		// 设置样式获取样式
		_private.render = function(){
			var self = this;
			var config = self.config;

			if(!config.hasHead) {
				self.dom.head.remove();
			}
			if(!config.hasClose) {
				self.dom.close.remove();
			}
			if(!config.hasFoot) {
				self.dom.foot.remove();
			}

			self.dom.box.css({
				'position': 'fixed', 
				'top': -1000, 
				'left':0, 
				'width': config.width, 
				'height': config.height,
				'pointer-events': 'auto',
				'overflow': 'visible',
				'zIndex': 1000
			});

			//self.dom.body.css('height', config.height);
			
			// 初始化起始点


			_private.updatePos.call(self);

			self.dom.box.css(self._startProp);

			
			self.dom.box.hide();
			
			// if(self.bind) {}


							
		};

		// 解析模板
		_static.parseTPL = function(data, tpl){
			for(var key in data) {
				tpl = tpl.replace('{' + key + '}', data[key]);
			}
			return tpl;
		};



	});
});
