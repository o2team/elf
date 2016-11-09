/**
 * @author Brucewan
 * @version 1.0
 * @date 2014-06-18
 * @description 该组件开发进行中
 * @extends mo.Base
 * @name mo.LaunchAPP
 * @requires lib/zepto.js
 * @requires src/base.js
 * @param {string} config.androidScheme android启动scheme
 * @param {string} config.iosScheme ios启动scheme
 * @param {string} config.androidInstallURL android app下载地址
 * @param {string} config.iosInstallURL ios app下载地址
 * @param {string} [config.wxAppID] 微信appid
 * @param {string} [config.packageName] android包名
 * @example
		var launch1 = new mo.LaunchAPP({
			androidScheme: 'candycrushsaga://tencent',
			iosScheme: 'tencent101021990://',
			androidInstallURL: 'http://xxxx.com/sss.apk',
			iosInstallURL: 'https://itunes.apple.com/cn/app/tang-guo-chuan-qi/id838804006?mt=8'
		});
*  @see   launch-app/demo.html 启动APP
 * @class
*/

define(function(require, exports, module) {

	require('../motion/motion.js');
	require('../../resource/qq/qqapi.js');

	
	Motion.add('mo.LaunchAPP', function() {

		/**
		 * public 作用域
		 * @alias mo.LaunchAPP#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.LaunchAPP.
		 * @ignore
		 */
		var _static = this.constructor;

		// 插件默认配置
		_static.config = {
			delay: 1000,
			nonSupport: '对不起，你的系统暂不支持！'
		};



		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config){

			this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收
			var self = this;	
			var config = self.config;

			if(!config.androidScheme || !config.androidInstallURL || !config.iosScheme || !config.iosInstallURL) {
				return;
			}

			var ua = navigator.userAgent;
			self.platform = {
				isAndroid: /Android;?[\s\/]+([\d.]+)?/.test(ua),
				isIOS: /(iPad|iPod|iPhone).*OS/.test(ua),
				isWeixin: /MicroMessenger/i.test(ua),
				isMobileQQ: /mobile.+qq/i.test(ua)
			};



			if(self.platform.isAndroid) {
				self.scheme = config.androidScheme;
				self.install = config.androidInstallURL;
				self.wxType = config.wxAppID ? 0 : 1;
			} else if(self.platform.isIOS){
				self.scheme = config.iosScheme;
				self.install = config.iosInstallURL;
				self.wxType = 0;
			} else {
				alert(config.nonSupport);
				return;
			}

			if(self.platform.isWeixin && (config.wxAppID || config.packageName)) {
				try{
					if(window.WeixinJSBridge) {
						_private.wxLaunch.call(self);
					} else {
						document.addEventListener('WeixinJSBridgeReady', function() {
							_private.wxLaunch.call(self);
						});	
					}
				}catch(e){}
			} else if(self.platform.isMobileQQ) {
				_private.qqLaunch.call(self);
			} else {
				_private.launch.call(self);
			}
							
			
		};

		_private.launch = function(){
			var self = this;
			var config = self.config;
			var startDate = new Date();
			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = self.scheme;


			document.body.appendChild(iframe);

			window.setTimeout(function(){
				document.body.removeChild(iframe);
				if(new Date() - startDate > 1000) {
					return;
				}
				window.location = self.install;
			}, 800);
		};

		_private.wxLaunch = function(){
			var self = this;
			var config = self.config;

			WeixinJSBridge.invoke('launch3rdApp',{
				'appID': config.wxAppID || config.iosScheme,
				'packageName': config.packageName,
				'signature': config.signature,
				'type': config.wxType
			},function(res){
				if(res.err_msg="launch_3rdApp:fail"){
					_private.launch.call(self);
				}
			});
		};

		_private.qqLaunch = function(){
			var self = this;
			var config = self.config;

			var name;
			if(self.platform.isAndroid) {
				name = config.packageName;
			} else {
				name = config.iosScheme;
			}
			mqq.app.isAppInstalled(name, function(result){
			    if(result){
					mqq.app.launchApp({
					    name: name
					});
			    }else{
			    	_private.launch.call(self);
			    }
			});
		};		



	});
});
