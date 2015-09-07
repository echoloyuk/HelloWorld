define(function (require, exports, module){

	//依赖的模块
	var marked = require('marked');

	//textarea组件的构造函数
	var TextArea = function ($target, option){

		//变量
		this.$target = null; //textarea的jQuery对象
		this.target = null; // textarea的DOM对象
		this.tabBtnSpace = 4; //tab键的默认空格数量，默认为4个空格
		this.onTextChange = null; //当任何文本发生变化时的回调函数。

		//内部变量
		this._id = 'MaCTextArea'; //组件内部id，用于事件的命名空间等。
		this._isShift = false; //组件内部的变量，用于记录是否按下shift。

		if ($target instanceof jQuery){
			this.$target = $target;
		} else {
			this.$target = $($target);
		}

		this.target = this.$target.get(0);

		if (option){
			$.extend(this, option);
		}
	}

	//内部方法
	$.extend(TextArea.prototype, {

		//去掉tab键等默认的按键在textarea上的作用。
		_removeDefaultBtnEffect: function (){
			var $target = this.$target,
				namespace = '.MaCTextAreaRemoveDefaultEffect';
			var _this = this;
			
			$target.off(namespace).on('keydown' + namespace, function (e){
				var keyCode = e.keyCode;

				if (keyCode === 9){
					e.preventDefault();
				}
			});
		},

		//添加默认键盘事件
		_addDefaultKeyEffect: function (){
			var $target = this.$target,
				namespace = '.MaCTextAreaAddDefaultEffect';
			var _this = this;

			//绑定shift按下的事件
			$target.off(namespace).on('keydown' + namespace, function (e){
				var keyCode = e.keyCode;
				if (keyCode === 16){
					_this._isShift = true;
				}

			//绑定shift抬起的事件
			}).on('keyup' + namespace, function (e){
				var keyCode = e.keyCode;
				if (keyCode === 16){
					_this._isShift = false;
				}
			});

			//绑定tab按键按下的默认缩进功能。
			$target.on('keydown' + namespace, function (e){
				var target = _this.target,
					content = _this.getContent(),
					keyCode = e.keyCode,
					space = _this.tabBtnSpace;
				var pos = _this.getSelectionPosition(),
					start = pos.start,
					end = pos.end;
				var firstLineOfRange, rangeStr, spaceStr;

				if (start < 0 || end < 0){
					console.log('selection error');
					return;
				}
				if (keyCode === 9 && !_this._isShift){

					//生成空格
					spaceStr = [];
					for (var i = 0; i < space; i++){
						spaceStr.push(' ');
					}
					spaceStr = spaceStr.join('');

					//如果是选中一个选区
					if (start !== end){
						/**/
						firstLineOfRange = content.lastIndexOf('\n', start);
						if (firstLineOfRange < 0){
							firstLineOfRange = 0;
						}
						rangeStr = content.substring(firstLineOfRange, end);
						rangeStr = rangeStr.replace(/\n/g, '\n' + spaceStr);
						if (firstLineOfRange === 0){
							rangeStr = spaceStr + rangeStr;
						}
						
						_this.replaceStr(firstLineOfRange, end, rangeStr);
					} else {

						//如果是字符
						_this.replaceStr(start, end, spaceStr, false);
					}
				}
			});
		}
	});

	//外部方法
	$.extend(TextArea.prototype, {

		//获得textarea的文本
		getContent: function (){
			return this.$target.val();
		},

		//初始化
		init: function (){

			//去掉默认事件
			this._removeDefaultBtnEffect();

			//绑定默认的自带事件
			this._addDefaultKeyEffect();
		},

		//获得光标位置
		getCursorPosition: function (){
			var $target = this.$target,
				target = this.target;
			var pos = target.selectionStart;
			return (pos >= 0 ? pos : -1);
		},

		//获得选中的位置
		getSelectionPosition: function (){
			var $target = this.$target,
				target = this.target;
			var start = target.selectionStart,
				end = target.selectionEnd;
			return {
				start : (start >= 0 ? start : -1),
				end : (end >= 0 ? end : -1)
			};
		},

		//将某个范围的文本替换为指定文字
		replaceStr: function (start, end, replaceStr, isSelect){
			var $target = this.$target,
				target = this.target,
				content = $target.val();
			var onTextChange = this.onTextChange;
			var strArr = [],
				strS, strE, finalStr;

			if (!$.isNumeric(start) || !$.isNumeric(end) || start < 0 || end < 0 || !replaceStr){
				console.log('start or end or replaceStr error');
				return;
			}
			strS = content.slice(0, start);
			strE = content.slice(end, content.length);
			strArr.push(strS);
			strArr.push(replaceStr);
			strArr.push(strE);
			finalStr = strArr.join('');
			$target.val(finalStr);

			//响应回调函数
			if (typeof onTextChange === 'function'){
				onTextChange.call(this, $target);
			}

			if (isSelect === false){
				target.selectionStart = target.selectionEnd = start + replaceStr.length;
			} else {
				//选中新替换的文字
				target.selectionStart = start;
				target.selectionEnd = start + replaceStr.length;
			}
		}
	});

	module.exports = TextArea;
});