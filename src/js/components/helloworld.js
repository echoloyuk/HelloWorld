/*
 * 编辑器组件，包含所有拓展和自带功能。
 * 作者：machi
 */

define(function (require, exports, module){

	//依赖的模块
	var MarkdownParser = require('MarkdownParser');
    var TextArea = require('TextArea');
    var Util = require('Util');

    //引入jquery form
    require('form');

    //id
    var id = 'HelloWorld';

	//CSS
	require('EditorCSS');

    var Editor = function ($target){
        this.$target = null; //编辑器放在哪个容器中。必须是jquery对象。
        this.textarea = null; //编辑器textarea变量
        this.imgUrl = 'prototype/uploader.php'; //编辑器的图片上传地址。该地址是后台上传路径。

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
                _this = this,
                $dialog = _this._getDialog(),
                namespace = '.HelloWorldUpLoadImgEvent',
                textarea = _this.textarea,
                $file, $alt, $submit, $autoClose, $form,
                html = '<div class="h-dialog-ctrl-panel">' +
                            '<div class="h-dialog-title">上传图片</div>' +
                            '<div class="h-dialog-ctrl-btn" id="hDialogCloseBtn">×</div>' +
                        '</div>' +
                        '<div class="h-dialog-form">' +
                            '<form id="imgUploadForm" enctype="multipart/form-data" method="post">' +
                                '<div class="h-dialog-input">' +
                                    '<span>图片：</span>' +
                                    '<input type="file" name="hImgUpLoadInput" id="hImgUpLoadInput" class="h-dialog-upfile" multiple/>' +
                                '</div>' +
                                '或' +
                                '<div class="h-dialog-input">' +
                                    '<span>网址：</span>' +
                                    '<input type="text" name="hImgLinkInput" id="hImgLinkInput"/>' +
                                '</div>' +
                                '<div class="h-dialog-input">' +
                                    '<span>标题：</span>' +
                                    '<input type="text" name="hImgAlt" class="h-dialog-text" id="hImgAlt" />' +
                                '</div>' +
                            '</form>' +
                            '<div class="h-dialog-upload-percentage" id="hImgUpLoadProcess">' +
                                '<div class="h-dialog-upload-inner"></div>' +
                            '</div>' +
                            '<div class="h-dialog-btn" id="hImgSubmitBtn">提交</div>' +
                            '<div class="h-dialog-info" id="hImgUpLoadInfo"></div>'
                        '</div>';

            var pos = textarea.getCursorPosition();
            textarea.$target.blur(); //需要把输入框的光标去掉。
            
            $dialog.empty().html(html); //增加css
            _this._showDialog(); //显示

            $file = $('#hImgUpLoadInput', $dialog);
            $link = $('#hImgLinkInput', $dialog);
            $alt = $('#hImgAlt', $dialog);
            $submit = $('#hImgSubmitBtn', $dialog);
            $autoClose = $('#hDialogCloseBtn', $dialog);
            $form = $('#imgUploadForm', $dialog);
            $info = $('#hImgUpLoadInfo', $dialog);

            //右上角关闭按钮的事件
            $autoClose.off(namespace).on('click' + namespace, function (){
                _this._hideImgUpLoadDialog(pos);
            });

            //提交按钮的点击事件
            $submit.off(namespace).on('click' + namespace, function (){
                if (!$link.val() && !$file.val()){
                    $info.html('请指定图片');
                    return;
                }
                if ($file.val()){
                    $form.ajaxSubmit({
                        url :_this.imgUrl,
                        type: 'POST',
                        xhr: function (){
                            var xhr = $.ajaxSettings.xhr();
                            xhr.upload.addEventListener('progress', _this._onUpLoadImgProgress(_this));
                            xhr.addEventListener('load', _this._onUpLoadImgComplete(_this, pos));
                            xhr.addEventListener('event', _this._onUpLoadImgError(_this));
                            //xhr.addEventListener('abort', _this._onUpLoadImgAbort);
                            return xhr;
                        },
                        processData:false
                    });
                } else { //直接写link

                }
                
                
            });

        },

        //内部回调。上传文件过程的回调函数。
        _onUpLoadImgProgress: function (_this){
            return function (e){
                var $target = _this.$target,
                    $dialog = _this._getDialog(),
                    $info = $('#hImgUpLoadInfo', $dialog),
                    $per = $('#hImgUpLoadProcess .h-dialog-upload-inner', $dialog);

                if (e.lengthComputable){
                    var percent = Math.round(e.loaded * 100 / e.total);
                    $per.css({
                        width: percent + '%'
                    });
                } else {
                    $info.html('不能计算上传进度...');
                    console && console.log('Cannot compute the percent, but it still uploading.');
                }
            }
        },

        //内部回调。上传文件成功的回调函数。
        _onUpLoadImgComplete: function (_this, pos){
            return function (e){
                var $target = _this.$target,
                    $dialog = _this._getDialog(),
                    alt = $('#hImgAlt', $dialog).val(),
                    $info = $('#hImgUpLoadInfo', $dialog),
                    textarea = _this.textarea,
                    result = e.target.responseText;

                // ![alg](http://www.baidu.com)
                var st = -1, en, str = '';
                if (alt){
                    en = alt.length - 1;
                    str += alt
                } else {
                    en = 2;
                    str += 'img';
                }
                str += '](' + result + ')';

                if (!result){
                    $info.html('上传出现了问题');
                } else {
                    textarea.replaceStr(pos, pos, str, true, st, en);
                }

                _this._hideImgUpLoadDialog();


            }
        },

        //内部回调。上传文件失败的回调函数
        _onUpLoadImgError: function (_this){
            return function (e){
                var $target = _this.$target,
                    $dialog = _this._getDialog(),
                    $info = $('#hImgUpLoadInfo', $dialog);
                $info.html('上传失败，原因：' + e.toString());
            }
        },

        //关闭上传图片窗口
        _hideImgUpLoadDialog: function (pos){
            var $target = this.$target,
                _this = this;
            var textarea = _this.textarea;
            
            _this._hideDialog();

            if (pos && $.isNumeric(pos)){
                textarea.setPosition(pos);
            }
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