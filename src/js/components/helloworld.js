/*
 * 编辑器组件，包含所有拓展和自带功能。
 * 作者：machi
 */

define(function (require, exports, module){

	//依赖的模块
	var MarkdownParser = require('MarkdownParser');
    var TextArea = require('TextArea');
    var Util = require('Util');

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

        //显示上传dialog
        _showImgUpLoadDialog: function(){
            var $target = this.$target,
                _this = this;
            var $dialog = _this._getDialog(),
                namespace = '.HelloWorldUpLoadImgEvent';
            var $file, $alt, $submit, $autoClose;
            var html = '<div class="h-dialog-ctrl-panel">' +
                            '<div class="h-dialog-title">上传图片</div>' +
                            '<div class="h-dialog-ctrl-btn" id="hDialogCloseBtn">×</div>' +
                        '</div>' +
                        '<div class="h-dialog-form">' +
                            '<div class="h-dialog-input">' +
                                '<span>图片：</span>' +
                                '<input type="file" id="hImgUpLoadInput" class="h-dialog-upfile" />' +
                            '</div>' +
                            '<div class="h-dialog-input">' +
                                '<span>标题：</span>' +
                                '<input type="text" class="h-dialog-text" id="hImgAlt" />' +
                            '</div>' +
                            '<div class="h-dialog-upload-percentage">' +
                                '<div class="h-dialog-upload-inner"></div>' +
                            '</div>' +
                            '<div class="h-dialog-btn" id="hImgUpLoadBtn">上传</div>' +
                        '</div>';
            
            $dialog.empty().html(html); //增加css
            _this._showDialog(); //显示

            $file = $('#hImgUpLoadInput', $dialog);
            $alt = $('#hImgAlt', $dialog);
            $submit = $('#hImgUpLoadBtn', $dialog);
            $autoClose = $('#hDialogCloseBtn', $dialog);

            $autoClose.off(namespace).on('click' + namespace, function (){
                _this._hideImgUpLoadDialog();
            });
        },

        //关闭上传图片窗口
        _hideImgUpLoadDialog: function (){
            var $target = this.$target,
                _this = this;
            var textarea = _this.textarea,
                pos = textarea.getCursorPosition();

            _this._hideDialog();
            
            textarea.setPosition(pos);
        },

        //初始化textarea
        _initTextArea: function (){
            var $target = this.$target,
                _this = this,
                textarea = new TextArea($('#hContent', $target));

            this.textarea = textarea;

            textarea.onTextChange = function (){
                _this._toPreview();
            };
            textarea.extendKeyEvent = [{
                type: 'keyup', //事件类型
                reg: /\!\[$/,
                handler: function (keyCode, curStr, content){
                    _this._showImgUpLoadDialog();
                }
            }];

            textarea.init();
        },

        //获得弹出框。该弹出框是单例模式，只允许一个弹出框显示。
        _getDialog: function (){
            var $target = this.$target,
                $dialog = $('.h-dialog', $target);

            if (!$dialog || !$dialog.length){
                $dialog = $('<div class="h-dialog h-img-upload" id="hImgUpLoad"></div>').appendTo($target);
            }

            return $dialog;
        },

        //显示dialog
        _showDialog: function (){
            var $target = this.$target,
                $dialog = this._getDialog(),
                $helloworld = $('#HelloWorld', $target);

            $helloworld.addClass('h-masked');
            $dialog.show();

            //显示在最中央
            Util.toDIVCenter($dialog);
        },

        //隐藏dialog
        _hideDialog: function (){
            var $target = this.$target,
                $dialog = this._getDialog(),
                $helloworld = $('#HelloWorld', $target);

            $helloworld.removeClass('h-masked');
            $dialog.hide();
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
            this._initTextArea();

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