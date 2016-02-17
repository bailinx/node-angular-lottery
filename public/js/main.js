'use strict';
require.config({
	paths: {
		'angular': "../libs/angular/angular",
		'angular-ui-router': "../libs/angular-ui-router/release/angular-ui-router",
		'ui-bootstrap-tpls': "../libs/angular-bootstrap/ui-bootstrap-tpls",
		'angular-animate': "../libs/angular-animate/angular-animate",
		'angular-toastr.tpls': "../libs/angular-toastr/dist/angular-toastr.tpls",
		'angular-local-storage': "../libs/angular-local-storage/dist/angular-local-storage",
		'domReady': "../libs/requirejs-domready/domReady",
		'ng-file-upload-all': "../libs/ng-file-upload/ng-file-upload-all",
		'socket-io': "../libs/socket.io-client/socket.io",
		'jquery': "../libs/jquery/dist/jquery",
		'snow': "../plug/snow/snow"
	},
	shim: {
		'angular': {
			'deps': ['jquery'],
			'exports': 'angular'
		},
		'angular-ui-router': {
			deps: ['angular']
		},
		'ui-bootstrap-tpls': {
			deps: ['angular']
		},
		'ng-file-upload-all': {
			deps: ['angular']
		},
		'angular-animate': {
			deps: ['angular']
		},
		'angular-toastr.tpls': {
			deps: ['angular']
		},
        'angular-local-storage': {
            deps: ['angular']
        },
		'socket-io': {
			exports: "io"
		},
		'snow': {
			deps: ['jquery']
		}
	},
	deps: ['./bootstrap']
});