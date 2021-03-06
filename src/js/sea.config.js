var version = '0.9.0';
seajs.config({
	alias:{

		//tools
		jquery: 'src/js/jquery.js', //jQuery
		marked: 'src/js/marked.js', //markdown parser
		form: 'src/js/jquery.form.js', //jquery.form.js

		//self code
		HelloWorld: 'src/js/components/helloworld.js',

		TextArea: 'src/js/components/textarea.js',
		EditorCSS: 'src/css/editor.css',
		MarkdownParser: 'src/js/components/markdownparser.js',
		Util: 'src/js/components/util.js'
	},
	preload: [
		'jquery'
	],
	debug:true,
	
	map:[
		['.js', '.js?v=' + version],
		['.css', '.css?v=' + version]
	],
	base: './'
})