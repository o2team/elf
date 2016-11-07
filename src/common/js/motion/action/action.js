/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-10-04
 * @description 从页面底部弹出的对话框，类似ios系统控件ActionSheet，和微信的操作提示框。
 * @extends mo.Overlay
 * @name mo.Action
 * @requires lib/zepto.js
 * @requires src/base.js
 * @param {boolean} [config.mask=true] 是否有蒙板
 * @param {boolean} [config.autoOpen=true] 是否自动打开对话框
 * @param {array} [ config.pos=&#91;'middle'&#93; ] 设置action打开位置
 * @param {string} [config.className='pop***'] 自定义class方便控制样式
 * @param {boolean} [config.buttons=['normal']] 操作按钮，如自定义文本{'text': '放弃'}
 * @param {object} [config.start= {}] 打开弹窗时起始状态
 * @param {object} [config.end={}] 打开弹窗时结束状态
 * @param {number} [config.duration=150] 动画时间，可设为0关闭动画
 * @param {string} [config.content=''] action内容
 * @param {string|number} [config.width='100%'] action宽度
 * @param {string|number} [config.height='auto'] overlay高度
 * @param {string} [config.type='alert'] action类型，[alert, success, error, none可选]
 * @param {string} [config.tpl=''] 弹窗模板
 * @example
		var action1 = new mo.Action('数据提交成功！');
 * @see action/demo1.html 普通ActionSheet
 * @see action/demo2.html 自定义buttons
 * @see action/demo3.html 自定义buttons高级使用
 * @class
*/
define(function(require, exports, module) {
	require('../overlay/overlay.js');
	require('./action.css');
	
	Motion.add('mo.Action:mo.Overlay', function() {

		/**
		 * public 作用域
		 * @alias mo.Action#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Action.
		 * @ignore
		 */
		var _static = this.constructor;

		// 插件默认配置
		_static.config = {
			tpl: '\
			<div class="mo-pop mo-pop-action">\
				<button class="mo-pop-close" type="button" title="关闭弹出层">关闭</button>\
				<div class="mo-pop-body"></div>\
				<div class="mo-pop-foot"></div>\
			</div>',
			type: 'alert',
			buttons: ['确定', '取消'],
			valign: 'bottom',
			hasFoot: true,
			// 设置初始状态
			start: {
			},

			// 设置结束状态
			end: {
			},
			width: '100%'
		};

		// 模板
		_private.tpl = {
			button: '<div class="{class}"><span>{text}</span></div>'
		};

		// 默认按钮类型
		_private.buttonType = {
			'normal': {
				'text': '确定',
				'className': 'mo-btn-normal',
				'callback': function(){
					_public.close.call(this);
				}
			},
			'strong': {
				'text': '确定',
				'className': 'mo-btn-strong',
				'callback': function(){
					_public.close.call(this);
				}
			},
			'weak': {
				'text': '取消',
				'className': 'mo-btn-weak',
				'callback': function(){
					_public.close.call(this);
				}
			}
		};


		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config){
			if(typeof config == 'string') {
				config = {content: config};
			}
			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			var self = this;	
			var config = self.config;

			_private.handleConfig.call(self);

			// 初始化父类
			self.superClass.call(self, config);



			_private.fillFoot.call(self);

			

		};

		_private.handleConfig = function(){

		};


		_private.fillFoot = function(){
			var self =this;
			var config = self.config;
			var buttons = config.buttons;
			// 填充按钮		
			self.buttons = [];
			self.dom.foot.empty();
			if (self.dom.foot.length > 0) {
				for (var i =  0; i < buttons.length; i++) {
					var domButton;
					var button =buttons[i];

					// 如果只是传入按钮类型
					if (typeof button === 'string') {
						var buttonType = 'normal';
						if(i == buttons.length - 1) {
							buttonType = 'weak';
						}
						if(i == 0) {
							buttonType = 'strong';
						}
						button = Zepto.extend({}, _private.buttonType[buttonType], {text: button});
						
					}

					if (button) {
						// 取nomal作为默认值
						button = Zepto.extend({}, _private.buttonType['normal'], button);
						domButton = Zepto(_private.tpl.button.replace('{class}', button.className).replace('{text}', button.text));
						domButton[0].moInfo = button;

						domButton.on('touchend', function(e){
							this.moInfo.callback.call(self);
							e.preventDefault();
						});
						
						self.buttons.push(domButton.appendTo(self.dom.foot));
					}

				}
			}	
		}


	});
});
