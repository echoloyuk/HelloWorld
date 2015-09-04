var version = '0.9.0';
seajs.config({
	alias:{

		//tools
		jquery: 'src/js/jquery.js', //jQuery
		marked: 'src/js/marked.js', //markdown parser

		//self code
		TextArea: 'src/js/textarea.js'
	},
	preload: [
		'jquery'
	],
	debug:true,
	
	map:[
		['.js', '.js?v=' + version],
		['.css', '.css?v=' + version]
	],
	base: 'http://127.0.0.1:808/HelloWorld/'
})