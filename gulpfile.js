var gulp           = require('gulp'),
    less           = require('gulp-less'),
    autoprefixer   = require('gulp-autoprefixer'),
    minifycss      = require('gulp-minify-css'),
    rename         = require('gulp-rename'),
    // 为服务器特别定制的，快速、灵活、实施精益(lean implementation)的jQuery核心
    cheerio        = require('gulp-cheerio'),
    rjs            = require('gulp-requirejs');

var path = {
    public   : "public/",
    css      : "public/css/",
    js       : "public/js/",
    less     : "public/less/",
    img      : "public/img/",
    dist     : "public/dist/"
}, env = {
    production: false
};

gulp.task('set-production', function() {
    env.production = true;
});

gulp.task('replace', function() {
    var rand = new Date().getSeconds();
    return  gulp.src(path.dist + 'index.html')
                .pipe(cheerio(function($) {
                    $('script').remove();
                    $('link').remove();
                    $('body').append('<script src="js/index.js"></script>');
                    $('head').append('<link rel="stylesheet" href="index.min.css?v='+ rand +'">');
                }))
                .pipe(rename('idx.html'))
                .pipe(gulp.dest(path.dist));
});

gulp.task('scripts', function() {
    rjs({
        //appDir: './public/js',
        baseUrl: "./public/js",
        removeCombined: true,
        // 不能直接混淆，ng会注入失败
        optimize: "none",
        paths: {
            'domReady': "../libs/requirejs-domready/domReady",
            'angular': "../libs/angular/angular",
            'uiRouter': "../libs/angular-ui-router/release/angular-ui-router",
            'uiBootstrap': "../libs/angular-bootstrap/ui-bootstrap-tpls",
            'angularAnimate': "../libs/angular-animate/angular-animate",
            'angularToastr': "../libs/angular-toastr/dist/angular-toastr.tpls",
            'angularStorage': "../libs/angular-local-storage/dist/angular-local-storage",
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
        name: "bootstrap",
        out: "build.js"
        //dir: "./public/build"
    }, function(buildResponse){
        console.log('build response', buildResponse);
    })
    .pipe(gulp.dest(path.dist));
        //.pipe(concat("index.js"))
        //.pipe(rename("index.min.js"))
});
// 编译less
gulp.task('css', function() {
    if(env.production) {
        return  gulp.src(path.less + '*.less')
                    .pipe(less())
                    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                    .pipe(gulp.dest('dist/css'))
                    .pipe(minifycss())
                    .pipe(rename({ suffix: '.min'}))
                    .pipe(gulp.dest(path.dist + 'css'));
    } else {
        return  gulp.src(path.less + '*.less')
                    .pipe(less())
                    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
                    .pipe(gulp.dest(path.dist + 'css'));
    }
});

// 监听
gulp.task('watch', function() {
    // 其实没必要监听所有
    return gulp.watch([
                path.less  + '**/*.*',
                path.dist + '*.html'
            ], ['css']);
});

gulp.task('default', ['watch']);
gulp.task('script', ['scripts']);
gulp.task('build', ['set-production', 'css', 'replace']);
