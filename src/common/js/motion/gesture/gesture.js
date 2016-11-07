/**
 * @author Aidenxiong
 * @version 1.0
 * @date 2014-08-20
 * @description 手势插件
 * @extends mo.Base
 * @name mo.Gesture
 * @param {HTMLElement} node 绑定手势的节点
 * @param {object} [config] 基本配置参数
 * @param {number} [config.preventDefault=false] 是否阻止默认时间
 * @example
		var gest = new mo.Gesture(document.getElementById('test')).addGesture('swiperight', handler);
 * @see gesture/gesture.html 组件使用
 * @class
*/

define(function(require, exports, module){
	require('../motion/motion.js');
	require('../base/base.js');
	Motion.add('mo.Gesture:mo.Base', function() {
		/**
		 * public 作用域
		 * @alias mo.Gesture#
		 * @ignore
		 */
		var _public = this;
		var _private = {
			/**
			 * 操作对象-插入到缓存对象中
			 * @param  {[type]} obj [description]
			 * @param  {[type]} key [description]
			 * @param  {[type]} val [description]
			 * @return {[type]}     [description]
			 */
			addCache : function(obj, key, val){
				if(obj[key]){
					obj[key].push(val)
				}else{
					obj[key] = [].concat(val);
				}
				return obj;
			},
			/**
			 * 操作对象-从缓存对象中删除
			 * @param  {[type]} obj [description]
			 * @param  {[type]} key [description]
			 * @param  {[type]} val [description]
			 * @return {[type]}     [description]
			 */
			cutCache : function(obj, key, val){
				if(obj[key]){
					obj[key] = obj[key].filter(function(v){
						return v != val;
					})
				}
				return obj;
			},
			/**
			 * [getDistance description]
			 * @param  {[type]} pos1 [description]
			 * @param  {[type]} pos2 [description]
			 * @return {[type]}      [description]
			 */
			getDistance : function(pos1, pos2){
				return {
					x : pos2.centerX - pos1.centerX,
					y : pos2.centerY - pos1.centerY
				}
			},
			/**
			 * 获取两个坐标点形成的角度
			 * @param  {[type]} pos1 [description]
			 * @param  {[type]} pos2 [description]
			 * @return {[type]}      [description]
			 */
			getAngle : function(pos1, pos2){
				var dis = _private.getDistance(pos1, pos2);
				return Math.atan2(dis.y, dis.x) * 180 / Math.PI;
			},
			/**
			 * 计算滑动的速度
			 * @param  {[type]} pos1 [description]
			 * @param  {[type]} pos2 [description]
			 * @param  {[type]} time [description]
			 * @return {[type]}      [description]
			 */
			getSpeed : function(pos1, pos2){
				var x, y, time, dis = _private.getDistance(pos1, pos2);
				x = dis.x;
				y = dis.y;
				time = pos2.timeStamp - pos1.timeStamp;
				return {
					x: Math.abs(x / time) || 0,
					y: Math.abs(y / time) || 0
				};
			},
			/**
			 * 获取两个坐标的相对位置
			 * @param  {[type]} pos1 [description]
			 * @param  {[type]} pos2 [description]
			 * @return {[type]}      [description]
			 */
			getDirect : function(pos1, pos2){
				var direction = {}
				var x, y, dis = _private.getDistance(pos1, pos2);
				x = dis.x;
				y = dis.y;
				direction.right = x > 0;
				direction.up = y < 0;
				return direction;
			},
			/**
			 * 获取多个触摸点的中心点
			 * @return {[type]} [description]
			 */
			getCenter : function(touches){
				var pageX = [],
				pageY = [],
				clientX = [],
				clientY = [],
				min = Math.min,
				max = Math.max;
				if(touches.length === 1) {
					return {
						pageX: touches[0].pageX,
						pageY: touches[0].pageY,
						clientX: touches[0].clientX,
						clientY: touches[0].clientY
					};
				}

				_private.each(touches, function(touch) {
					pageX.push(touch.pageX);
					pageY.push(touch.pageY);
					clientX.push(touch.clientX);
					clientY.push(touch.clientY);
				});

				return {
					pageX: (min.apply(Math, pageX) + max.apply(Math, pageX)) / 2,
					pageY: (min.apply(Math, pageY) + max.apply(Math, pageY)) / 2,
					clientX: (min.apply(Math, clientX) + max.apply(Math, clientX)) / 2,
					clientY: (min.apply(Math, clientY) + max.apply(Math, clientY)) / 2
				};
			},
			/**
			 * each兼容写法
			 * @param  {[type]} obj     [description]
			 * @param  {[type]} func    [description]
			 * @param  {[type]} context [description]
			 * @return {[type]}         [description]
			 */
			each: function(obj, func, context) {
				var i, len;
				if('forEach' in obj) {
					obj.forEach(func, context);
				} else if(obj.length !== undefined) {
					for(i = 0, len = obj.length; i < len; i++) {
						if(func.call(context, obj[i], i, obj) === false) {
						return;
						}
					}
				} else {
					for(i in obj) {
						if(obj.hasOwnProperty(i) &&
							func.call(context, obj[i], i, obj) === false) {
							return;
						}
					}
				}
			},
			/**
			 * 通过角度判断操作方向
			 * @param  {number} angle 角度
			 * @return {string}       操作方向
			 */
			getDirectByAngle : function(angle){
				var absAngle = Math.abs(angle);
				if(absAngle < 45){
					return 'right';
				}else if(absAngle > 135){
					return 'left';
				}else if(angle > 0){
					return 'down'
				}
				return 'up';
			},
			/**
			 * 获取唯一的一个key
			 * @return {number}
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
		 * 事件相关处理
		 * @type {Object}
		 */
		var evt = {
			/**
			 * 阻止冒泡
			 * @param  {[type]} e    [description]
			 * @param  {[type]} opts [description]
			 * @return {[type]}      [description]
			 */
			prevent : function(e, opts){
				opts.preventDefault && e.preventDefault();
			},
			/**
			 * 从一堆参数中获取有效的属性
			 * @param  {[type]} e [description]
			 * @return {[type]}   [description]
			 */
			filter : function(e){
				var center = _private.getCenter(e.touches);
				return {
					centerX : center.clientX,
					centerY : center.clientY,
					target : e.target || e.srcElement,
					type : e.type,
					touches : e.touches,
					timeStamp : e.timeStamp
				};
			},
			/**
			 * 构建绑定事件所得到的参数
			 * @return {[type]} [description]
			 */
			getEventData : function(args){
				var keys = ['action','angle','speed','preventDefault','distance','durTime','orginEvent']
				var obj = {}
				for(var k in args){
					if(keys.indexOf(k) > -1){
						obj[k] = args[k];
					}
				}
				return obj;
			},
			/**
			 * 执行自定义的手势
			 * @param  {[type]} action [description]
			 * @return {[type]}        [description]
			 */
			runGesture : function(e, action, opts){
				evt.prevent(e, opts);
				if(opts.stopPropagation){
					e.stopPropagation()
				}
				
				var _this = this, sPos, cPos;
				sPos = this.posInfo.start;
				cPos = this.posInfo.current;
				if(e.type != 'touchend'){
					cPos = this.posInfo.current = evt.filter(e);
				}else{
					this.posInfo.current = evt.filter(e);
					this.posInfo.current.centerX = cPos.centerX;
					this.posInfo.current.centerY = cPos.centerY;
					cPos = this.posInfo.current;
				}
				for(var k in Gesture.gestureActions){
					Gesture.gestureActions[k].forEach(function(func, i, arr){
						var retInfo = {
							action : action,
							instance : _this,
							option : opts,
							angle : _private.getAngle(sPos, cPos),
							speed : _private.getSpeed(sPos, cPos),
							distance : _private.getDistance(sPos, cPos),
							durTime : cPos.timeStamp - sPos.timeStamp,
							direction : _private.getDirect(sPos, cPos),
							preventDefault: e.preventDefault,
							runEvents : evt.runEvents,
							orginEvent : e
						}
						func(retInfo);
					});
				}
			},
			runEvents : function(actType, args){
				var evts = args.instance.eventCache[actType];
				evts && evts.forEach(function(v, i, arr){
					var outData = evt.getEventData(args);
					outData.type = actType;
					v(outData);
				});
			}
		};

		var touchEvents = {
			touchstart : function(e, opts){
				this.posInfo.start = evt.filter(e);
				evt.runGesture.call(this, e, 'start', opts);
			},
			touchmove : function(e, opts){
				evt.runGesture.call(this, e, 'move', opts);
			},
			touchend : function(e, opts){
				evt.runGesture.call(this, e, 'end', opts);
			}
		}
		var gestureCache = {};
		/**
		 * public static作用域
		 * @alias mo.Gesture.
		 * @ignore
		 */
		var _static = this.constructor;
		var Gesture;

		_public.init = Gesture = function(node, opts){
			node = Zepto(node || document);
			opts = Zepto.extend(true, {}, _static.config, opts);
			this.eventCache = {};
			this.posInfo = {}
			var _this = this;
			for(var k in touchEvents){
				(function(k){
					node.on(k, function(e){
						touchEvents[k].call(_this, e, opts)
					});
				})(k)
			}
		}
		Gesture.gestureActions = {};
		/**
		 * 添加手势插件
		 * @param {Object} pluginOption 插件配置信息
		 */
		Gesture.addPlugin = function(pluginOption){
			var lastOption = pluginOption;
			var handler = function(eventInfo){
				//配置参数合并
				lastOption = Zepto.extend(true,{},lastOption, eventInfo);
				// opts.option = Zepto.extend(true,{},pluginOption.option, eventInfo.option);
				pluginOption.handler(lastOption);
			}
			_private.addCache(Gesture.gestureActions, pluginOption.name.toLowerCase(), handler);
			return Gesture;
		}

		/**
		 * 增加触摸插件
		 */
		Gesture.addPlugin({
			name : 'touch',  //自定义的事件名称
			direction : true,  //该事件是否需要对方向进行判断
			option : {},
			handler : function(args){
				var actType = args.name+args.action;
				args.runEvents(actType, args);
				if(args.action == 'move'){
					var angle = args.angle;
					dir = _private.getDirectByAngle(angle);
					actType = args.name+dir;
					args.runEvents(actType, args);
				}
			}
		});
		/**
		 * 增加划屏插件
		 */
		Gesture.addPlugin({
			name : 'swipe',  //自定义的事件名称
			direction : true,  //该事件是否需要对方向进行判断
			option : {
				swipeSpeed : 0.5
			},
			handler : function(args){
				if(args.action == 'end'){
					var dir = '';
					var angle = args.angle;
					if(args.speed.x >= args.option.swipeSpeed || args.speed.y >= args.option.swipeSpeed){ //需要促发左右swipe事件
						dir = _private.getDirectByAngle(angle);
					}
					var actType = args.name+dir;
					args.runEvents(actType, args);
				}
			}
		});
		/**
		 * 增加按住插件
		 */
		Gesture.addPlugin({
			name : 'hold',
			option : {
				holdTime : 1000,
				offset : 10
			},
			extra : {},
			handler : function(args){
				if(args.action != 'end'){
					var actType = args.name;
					if(Math.abs(args.distance.x) > args.option.offset || Math.abs(args.distance.y) > args.option.offset){
						args.extra.timer && clearTimeout(args.extra.timer);
						args.extra.timer = null;
					}else{
						if(!args.extra.timer){
							args.extra.timer = setTimeout(function(){
								args.runEvents(actType, args);
							}, args.option.holdTime);
						}
					}
				}else{
					args.extra.timer && clearTimeout(args.extra.timer);
					args.extra.timer = null;
				}
			}
		});
		/**
		 * 增加轻击插件
		 */
		Gesture.addPlugin({
			name : 'tap',
			option : {
				tapTime : 500,  //触发tap事件的最长事件
				offset : 10
			},
			extra : {},
			handler : function(args){
				if(args.action == "start"){
					args.extra.timer = setTimeout(function(){
						args.extra.timer = null;
					}, args.option.tapTime);
				}else if(args.action == "end"){
					var actType = args.name;
					if(args.extra.timer && Math.abs(args.distance.x) <= args.option.offset && Math.abs(args.distance.y) <= args.option.offset){
						args.runEvents(actType, args);
					}
					args.extra.timer && clearTimeout(args.extra.timer);
					args.extra.timer = null;
				}
			}
		})

		// _public.constructor = Gesture;

		// 插件默认配置
		_static.config = {
			preventDefault : true
		};

		/**
		 * 添加手势动作
		 * @param {string} type 需要添加的动作名称
		 * @param {[type]} func 执行的函数句柄
		 */
		_public.addGesture = function(type, func){
			func = func || function(){}
			var types = type.split(' ');
			var _this = this;
			types.forEach(function(type){
				_private.addCache(_this.eventCache, type, func);
			});
			return this;
		}

		/**
		 * 删除手势动作
		 * @param  {string} type 需要删除的动作名称
		 * @param  {[type]} func 需要删除的函数句柄
		 */
		_public.removeGesture = function(type, func){
			func = func || function(){}
			var types = type.split(' ');
			var _this = this;
			types.forEach(function(type){
				_private.cutCache(_this.eventCache, type, func);
			})
			return this;
		}
	})

});