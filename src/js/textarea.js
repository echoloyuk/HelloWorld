define(function (require, exports, module){

	//依赖的模块
	var marked = require('marked');

	//textarea组件的构造函数
	var TextArea = function ($target){

		//变量
		this.$target = null; //textarea的jQuery对象
		this.target = null; // textarea的DOM对象

		//内部变量
		this._id = 'MaCTextArea'; //组件内部id，用于事件的命名空间等。

		if ($target instanceof jQuery){
			this.$target = $target;
		} else {
			this.$target = $($target);
		}

		this.target = this.$target.get(0);
	}

	//内部方法
	$.extend(TextArea.prototype, {

		//去掉tab键等默认的按键在textarea上的作用。
		_removeDefaultBtnEffect: function (){
			var $target = this.$target,
				namespace = '.MaCTextAreaDefaultKeyboardEvent';
			var _this = this;
			
			$target.off(namespace).on('keydown' + namespace, function (e){
				var keyCode = e.keyCode;

				if (keyCode === 9){
					e.preventDefault();
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
		}
	});

	module.exports = TextArea;
});