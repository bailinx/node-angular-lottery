'use strict';
require.config({
	paths: {
		'angular': "../libs/angular/angular",
		'uiRouter': "../libs/angular-ui-router/release/angular-ui-router",
		'uiBootstrap': "../libs/angular-bootstrap/ui-bootstrap-tpls",
		'angularAnimate': "../libs/angular-animate/angular-animate",
		'angularToastr': "../libs/angular-toastr/dist/angular-toastr.tpls",
		'domReady': "../libs/requirejs-domready/domReady",
		'ngFileUpload': "../libs/ng-file-upload/ng-file-upload-all",
		'io': "../libs/socket.io-client/socket.io",
		'btford.socket-io': '../libs/angular-socket-io/socket'
	},
	shim: {
		'angular': {
			'exports': 'angular'
		},
		'btford.socket-io': {
			'deps': ['angular', 'io']
		},
		'uiRouter': {
			deps: ['angular']
		},
		'uiBootstrap': {
			deps: ['angular']
		},
		'ngFileUpload': {
			deps: ['angular']
		},
		'angularAnimate': {
			deps: ['angular']
		},
		'angularToastr': {
			deps: ['angular']
		}
	},
	deps: ['./bootstrap']
});