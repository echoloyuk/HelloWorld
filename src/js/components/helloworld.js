/*
 * 编辑器组件，包含所有拓展和自带功能。
 * 作者：machi
 */

define(function (require, exports, module){

	//依赖的模块
	var MarkdownParser = require('MarkdownParser');
    var TextArea = require('TextArea');

    //console.log(MarkdownParser);

    //id
    var id = 'HelloWorld';

	//CSS
	require('EditorCSS');

    var Editor = function ($target){
        this.$target = null; //编辑器放在哪个容器中。必须是jquery对象。
        this.textarea = null; //编辑器textarea变量

        if ($target instanceof jQuery){
            this.$target = $target;
        } else {
            this.$target = $($target);
        }
    };

    //内部方法
    $.extend(Editor.prototype, {

        //生成编辑器主体html
        _createMainHTML: function (){
            var $target = this.$target;
            var html = '' +
            '<div class="h-outer" id="' + id + '">' +
                '<div class="h-textarea">' +
                    '<div class="h-title-panel">' +
                        '<input type="text" id="hTitle" class="h-title" placeholder="在这里输入标题">' +
                    '</div>' +
                    '<div class="h-tool-panel">' +
                        '<div class="h-tool-item h-tool-pic" title="图片">图片</div>' +
                        '<div class="h-tool-item h-tool-pic" title="链接">链接</div>' +
                    '</div>' +
                    '<div class="h-content-panel">' +
                        '<textarea class="h-content" id="hContent" placeholder="在这里输入正文"></textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="h-preview" id="hPreview">' +
                    '<div class="h-text-content-title">在这里输入标题</div>' +
                    '<div class="h-text-content">' +
                    '</div>' +
                '</div>' +
            '</div>';
            var $html = $('#' + id, $target);

            if (!$html.length){
                $html = $(html).appendTo($target);
            }
        },

        //自动生成正文
        _toPreview: function (){
            var $target = this.$target,
                title = $('#hTitle', $target).val(),
                text = this.textarea.getContent(),
                $prev = $('#hPreview', $target),
                $titlePanel = $('.h-text-content-title', $prev),
                $contentPanel = $('.h-text-content', $prev);

            $titlePanel.html((title || '无标题'));
            $contentPanel.html(MarkdownParser(text));
        },

        //获得弹出框。该弹出框是单例模式，只允许一个弹出框显示。
        _getDialog: function (){

        },

        //获得提示框。该提示框是单例模式，只允许一个提示框显示。
        _getTips: function (){
            
        }

    });

    //外部方法
    $.extend(Editor.prototype, {

        //初始化
        init: function (){
            var $target = this.$target,
                $title, $textarea;
            var namespace = '.HelloWorldTitleEvent';
            var _this = this;

            //生成主体html
            this._createMainHTML();

            $title = $('#hTitle', $target),
            $textarea = $('#hContent', $target);

            //初始化textarea
            this.textarea = new TextArea($('#hContent', $target));
            this.textarea.onTextChange = function (){
                _this._toPreview();
            };
            this.textarea.init();

            //-------init变量完毕------

            //绑定title的事件
            $title.off(namespace).on('keyboardInput' + namespace, function (){
                _this._toPreview();
            }).on('input' + namespace, function (){
                $(this).trigger('keyboardInput');
            });

            //绑定content事件
            $textarea.off(namespace).on('keyboardInput', function (){
                _this._toPreview();
            }).on('input' + namespace, function (){
                $(this).trigger('keyboardInput');
            });
        },

        //拓展
        extend: function (obj){
            $.extend(this, obj);
        }
    });

	module.exports = Editor;
});