var version = '0.9.0';
seajs.config({
	alias:{
		jquery: 'js/jquery.js'
	},
	preload: [
		'jquery'
	],
	debug:true,
	paths: {
		js:'./src/js/',
		css: './src/css'
	},
	map:[
		['.js', '.js?v=' + version],
		['.css', '.css?v=' + version]
	]
})