define(['require', 'angular', 'app', 'routes'],
	function (document, ng) {
		'use strict';
		require(['domReady!'], function (document) {
			ng.bootstrap(document, ['app']);
		});
	}
);
