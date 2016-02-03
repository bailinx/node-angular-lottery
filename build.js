({
    appDir: './public/js',
    baseUrl: "./",
    removeCombined: true,
    // 不能直接混淆，ng会注入失败
    optimize: "none",
    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000
    },
    paths: {
        'angular': "../libs/angular/angular",
        'uiRouter': "../libs/angular-ui-router/release/angular-ui-router",
        'uiBootstrap': "../libs/angular-bootstrap/ui-bootstrap-tpls",
        'angularAnimate': "../libs/angular-animate/angular-animate",
        'angularToastr': "../libs/angular-toastr/dist/angular-toastr.tpls",
        'angularStorage': "../libs/angular-local-storage/dist/angular-local-storage",
        'domReady': "../libs/requirejs-domready/domReady",
        'ngFileUpload': "../libs/ng-file-upload/ng-file-upload-all",
        'socket.io': "../libs/socket.io-client/socket.io",
        'btford.socket-io': '../libs/angular-socket-io/socket',
        'jquery': "../libs/jquery/dist/jquery",
        'snow': "../plug/snow/snow"
    },
    shim: {
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'btford.socket-io': {
            'deps': ['angular', 'socket.io']
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
        },
        'angularStorage': {
            deps: ['angular']
        }
    },
    modules: [{
        name: "main",
        include: [ './routes', './app', './bootstrap' ],
        exclude: [ 'angular', 'uiRouter', 'uiBootstrap', 'angularAnimate', 'angularToastr',
            'angularStorage', 'domReady', 'ngFileUpload', 'socket.io', 'btford.socket-io',
            'jquery', 'snow'
        ]

    }],
    dir: "./public/build",
    // 试了下，r.js并不太好用，尝试gulp或webpack
})