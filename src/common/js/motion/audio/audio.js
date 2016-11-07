/**
 * @author Brucewan
 * @version 1.0
 * @date 2015-07-20
 * @description 切换类中
 * @extends mo.Base
 * @name mo.Audio
 * @requires lib/zepto.js
 * @requires src/base.js
 * @param {string} config.src 需要播放的音频地址，需要同域，或允许跨域请求（accect: *\/*），如果是跨域的音频地址，将只支持基础的功能；
 * @param {object|string} [config.controller] 显示波形的容器；
 * @param {boolean} [config.autoPlay=true] 是否自动播放；
 * @param {boolean} [config.loop=true] 是否循环播放；
 * @param {string} [config.effect='none'] 给音频添加的效果（'cave', 'lodge', 'parking', 'lowpass', 'telephone', 'spatialized', 'backwards', 'wildecho'）；
 * @param {string} [config.fillColor] 波形填充颜色，eg.'#ff0000'；
 * @param {number} [config.fillNum=12] 容器宽度最好为fillNum的整数倍，eg. fillNum=12，容器宽度为60px
 * @example
		var audio = new mo.Audio({
			src: 'http://ossweb-img.qq.com/images/audio/motion/audio4.mp3',
			controller: $('.bg-music')
		});
 * @see audio/normal.html 跟随音乐起舞！-
 * @see audio/animate.html 让整个页面舞动起来
 * @see audio/effect.html 音乐特效
 * @class
*/


define(function(require, exports, module) {
	require('../motion/motion.js');
	require('../base/base.js');
	Motion.add('mo.Audio:mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Audio#
		 * @ignore
		 */
		var _public = this;

		var _private = {};

		/**
		 * public static作用域
		 * @alias mo.Audio.
		 * @ignore
		 */
		var _static = this.constructor;


		// 插件默认配置
		_static.config = {
			// src 音频地址
			// 
			autoPlay: true,
			loop: true,
			effect: 'none',
			useWebAudio: true,
			// fillColor: '#00aaff',
			fillNum: 12
		};

		_private.effects = {
			'cave': 'http://ossweb-img.qq.com/images/audio/motion/effect1.wav',
			'lodge': 'http://ossweb-img.qq.com/images/audio/motion/effect2.wav',
			'parking': 'http://ossweb-img.qq.com/images/audio/motion/effect3.wav',
			'lowpass': 'http://ossweb-img.qq.com/images/audio/motion/lowpass.wav',
			'telephone': 'http://ossweb-img.qq.com/images/audio/motion/telephone.wav',
			'spatialized': 'http://ossweb-img.qq.com/images/audio/motion/spatialized.wav',
			'backwards': 'http://ossweb-img.qq.com/images/audio/motion/backwards.wav',
			'wildecho': 'http://ossweb-img.qq.com/images/audio/motion/wildecho.wav'
		}

		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;



		/***
		 * 初始化
		 * @description 参数处理
		 */
		_public.init = function(config) {
			/**
			 * @alias mo.Audio#
			 * @ignore
			 */			
			var self = this;
			var config = self.config = Zepto.extend(true, {}, _static.config, config); // 参数接收

			self.playing = false;

			// 如果访问环境支持AudioContext
			try {
				self.audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)();
			} catch(e){
				config.useWebAudio = false;
			}

			config.fillNum = parseInt(config.fillNum) || 4;


			/**
			 * @event mo.Audio#beforeinit
			 * @property {object} event 
			 */
			self.trigger('beforeinit');


			_private.create.call(self);

			self.on('init', function(){
				if(!config.useWebAudio) {
					self.audio.loop = config.loop;
				} else {
					
				}				
				if(config.autoPlay) {
					self.play();
				}

				_private.attach.call(self);		



				requestAnimationFrame(function(){
					var lastTime = self.currentTime;
					if(self.audio) {
						/**
						 * 当前播放时间
						 * @type {number}
						 */
						self.currentTime = self.audio.currentTime;
					} else {
						self.currentTime = self.audioContext.currentTime;
					}
					
					if(self.frequencyData && lastTime !== self.currentTime) {
						/**
						 * @event mo.Audio#progress
						 * @property {object} event 
						 */
						self.trigger('progress', self.frequencyData);
					}

					requestAnimationFrame(arguments.callee);
				});
			});






		};

		_private.create = function(){
			var self = this;
			var config = self.config;

			if(self.audioContext && config.useWebAudio) {
				_private.get(config.src, function(data){
					self.arrayBuffer = data;
					/**
					 * @event mo.Audio#init
					 * @property {object} event 
					 */
					self.trigger('init');
				}, function(error){
					// 如果该音频不允许跨域访问
					config.useWebAudio = false;
					_private.create.call(self);
				});
			} else {
				self.audio = document.createElement('audio');
				self.audio.src = config.src;
				window.setTimeout(function(){
					self.trigger('init');		
				}, 0);
			}
		}

		_private.attach = function(){
			var self = this;
			var config = self.config;

			Zepto(config.controller).on('touchEnd mousedown', function(){
				if(self.playing) {
					self.pause()
				} else {
					self.play();
				}
			});

			// self.audio.addEventListener('x', function(){

			// });
		}

		_private.getWave = function(){
			var self = this;
			var config = self.config;
			var audioContext = self.audioContext;
			var analyser = self.analyser = audioContext.createAnalyser();
			// var processor=audioContext.createScriptProcessor(4096,1,1);

			//连接：媒体节点→控制节点→输出源
			// sound.connect(processor);
			// processor.connect(audioContext.destination);
			self.analyser.smoothingTimeConstant = 0.85;
			self.analyser.fftSize = 32;
			self.frequencyData = new Uint8Array(analyser.frequencyBinCount);		
		}

		/**
		 * 播放音频
		 */
		_public.play = function(){
			var self = this;
			var config = self.config;		
			var currentTime = self.currentTime || 0;

			if(self.playing) {
				return;
			}
			/**
			 * 当前播放状态
			 * @type {boolean}
			 */
			self.playing = true;

			if(config.useWebAudio) {
				var sound = self.sound = self.audioContext.createBufferSource();
				self.audioContext.decodeAudioData(self.arrayBuffer, function(buffer) {
					sound.buffer = buffer;
					sound.connect(self.audioContext.destination);
					sound.loop = config.loop;

				if(config.effect != 'none') {
					self.applyEffect(config.effect);					
				}
		

					sound.start(0,currentTime);
					_private.getWave.call(self);

					self.analyser.getByteFrequencyData(self.frequencyData);
		
					self.sound.connect(self.analyser);

					if(config.controller) {
						_private.draw.call(self);
					}
				});	
			} else {
				self.audio.currentTime = currentTime; 
				self.audio.play();

				if(config.controller) {
					_private.draw.call(self);
				}
			}
		}

		/**
		 * 暂停音频
		 */
		_public.pause = function(){
			var self = this;
			var config = self.config;	
			self.playing = false;
			if(config.useWebAudio) {
				self.sound.stop();
				self.currentTime = self.audioContext.currentTime;
			} else {
				self.currentTime = self.audio.currentTime;
				self.audio.pause();
			}
		}

		/**
		 * 停止音频
		 */
		_public.stop = function(){
			this.pause();
			this.currentTime = 0;
		}

		_private.createCanvas = function(){
			var self = this;
			var config = self.config;
			var controller = config.controller;

			var canvas = $('<canvas>').appendTo(config.controller);
			canvas = canvas[0];
			canvas.height = controller.offset().height;
			canvas.width = controller.offset().width;

			var ctx = canvas.getContext("2d");
			ctx.imageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
			self.canvas = canvas;
		}

		_private.draw = function(){
			var self = this;
			var config = self.config;
			var color = ['#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00', '#ccff00', '#99ff00', '#66ff00', '#33ff00', '#00ff00'];



			if(!self.canvas) {
				_private.createCanvas.call(self);
			}

			var controller = config.controller;
			var canvas = self.canvas;
			var ctx = self.canvas.getContext("2d");



			
			function drawSpectrum() {
				if(!self.playing) return;
				var frequencyBinCount = 16;
				if(config.useWebAudio) {
					self.analyser.getByteFrequencyData(self.frequencyData);
					frequencyBinCount = self.analyser.frequencyBinCount;
				} else {
					if(!self.frequencyData) {
						self.frequencyData = [255, 254, 211, 153, 127, 109, 76, 35, 5, 0, 0, 0, 0, 0, 0, 0]
					}
					for(var i = 0; i < self.frequencyData.length; i++) {
						var val = self.frequencyData[i];
						val += Math.random() * 20 -  10;
						val = val > 255 ? 255 : val;
						val = val < 0 ? 0 : val;
						self.frequencyData[i] = val;
					}
				}

				var bar_width = Math.floor(canvas.width / config.fillNum);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				var freq, x, y, w, h;
				
				
				for (var i = 0; i < frequencyBinCount; i++) {
					// freq = Math.floor(Math.random()*255);
					// if(config.useWebAudio) {
						freq = self.frequencyData[i] || 0;
					// }
					
					
					x = bar_width * i;
					if (x + bar_width < canvas.width) {
						y = canvas.height;
						w = bar_width - 1;
						h = -(Math.floor(freq / 255 * canvas.height) + 1);
						// console.log(parseFloat(i/config.fillNum);
						// ctx.fillStyle = config.fillColor;
						ctx.fillStyle = config.fillColor || color[i] || '#ff0000';
						ctx.fillRect(x, y, w, h)
					}
				}
				
				if (!self.pause_vis) {
					requestAnimationFrame(drawSpectrum);
				} else {
					ctx.clearRect(0, 0, canvas.width, canvas.height)
				}
			}


			drawSpectrum();
		}

		_private.get = function(url, success, error) {
			var req = new XMLHttpRequest;
			req.open('GET', url, true);
			req.responseType = 'arraybuffer';
			req.onload = function(){
				success && success.call(this, req.response);
			};
			req.onerror = function(e){
				error && error.call(this, e);
			};
			req.send();
		}

		/**
		 * 应用音频效果，可选效果：'cave', 'lodge', 'parking', 'lowpass', 'telephone', 'spatialized', 'backwards', 'wildecho'
		 * @param {string} url
		 */
		_public.applyEffect = function(url) {
			var self = this;
			var config = self.config;

			if(!/^http/i.test(url)) {
				url = _private.effects[url];
			}

			if(!url) {
				return;
			}

			if(self.convolver) {
				self.convolver.disconnect();
			}

			var convolver = self.convolver = self.audioContext.createConvolver();
			_private.get(url, function(data){
				self.audioContext.decodeAudioData(data, function (buffer) {console.log(1);
					convolver.buffer = buffer;
					self.sound.connect(convolver);
					convolver.connect(self.audioContext.destination);
				});
			});

		}


	});
});