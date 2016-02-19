var gulp           = require('gulp'),
    gulpSequence   = require('gulp-sequence'),
    less           = require('gulp-less'),
    autoprefixer   = require('gulp-autoprefixer'),
    minifycss      = require('gulp-minify-css'),
    minifyHtml     = require("gulp-minify-html"),
    rename         = require('gulp-rename'),
    rimraf         = require('rimraf'),
    cheerio        = require('gulp-cheerio'),
    uplify         = require('gulp-uglify'),
    concat         = require('gulp-concat'),
    amdOptimize    = require('amd-optimize'),
    ngAnnotate     = require('gulp-ng-annotate');
    //rjs            = require('gulp-requirejs');

var path = {
    public   : "public/",
    css      : "public/css/",
    js       : "public/js/",
    less     : "public/less/",
    img      : "public/images/",
    dist     : "dist/"
}, env = {
    production: false
};

gulp.task('set-production', function() {
    env.production = true;
});

gulp.task('replace', function() {
    var rand = new Date().getTime();
    return  gulp.src(path.dist + 'index.html')
                .pipe(cheerio(function($) {
                    $('script').remove();
                    $('link').remove();
                    $('body').append('<script data-main="js/bootstrap" src="js/require.js"></script>');
                    $('head').append('<link rel="stylesheet" href="css/app.min.css?v='+ rand +'">');
                }))
                .pipe(gulp.dest(path.dist));
});

//gulp.task('scripts', function() {
//    rjs({
//        //appDir: './public/js',
//        baseUrl: "./public/js",
//        removeCombined: true,
//        // 不能直接混淆，ng会注入失败
//        optimize: "none",
//        paths: {
//            'domReady': "public/libs/requirejs-domready/domReady",
//            'angular': "public/libs/angular/angular",
//            'uiRouter': "public/libs/angular-ui-router/release/angular-ui-router",
//            'uiBootstrap': "public/libs/angular-bootstrap/ui-bootstrap-tpls",
//            'angularAnimate': "public/libs/angular-animate/angular-animate",
//            'angularToastr': "public/libs/angular-toastr/dist/angular-toastr.tpls",
//            'angularStorage': "public/libs/angular-local-storage/dist/angular-local-storage",
//            'ngFileUpload': "public/libs/ng-file-upload/ng-file-upload-all",
//            'socket.io': "public/libs/socket.io-client/socket.io",
//            'btford.socket-io': 'public/libs/angular-socket-io/socket',
//            'jquery': "public/libs/jquery/dist/jquery",
//            'snow': "../plug/snow/snow"
//        },
//        shim: {
//            'angular': {
//                'deps': ['jquery'],
//                'exports': 'angular'
//            },
//            'btford.socket-io': {
//                'deps': ['angular', 'socket.io']
//            },
//            'uiRouter': {
//                deps: ['angular']
//            },
//            'uiBootstrap': {
//                deps: ['angular']
//            },
//            'ngFileUpload': {
//                deps: ['angular']
//            },
//            'angularAnimate': {
//                deps: ['angular']
//            },
//            'angularToastr': {
//                deps: ['angular']
//            },
//            'angularStorage': {
//                deps: ['angular']
//            }
//        },
//        modules: [{
//            name: "main",
//            include: [ './routes', './app', './bootstrap' ],
//            exclude: [ 'angular', 'uiRouter', 'uiBootstrap', 'angularAnimate', 'angularToastr',
//                'angularStorage', 'domReady', 'ngFileUpload', 'socket.io', 'btford.socket-io',
//                'jquery', 'snow'
//            ]
//
//        }],
//        name: "bootstrap",
//        //out: "build.js"
//        dir: "./public/build"
//    }, function(buildResponse){
//        console.log('build response', buildResponse);
//    })
//    .pipe(gulp.dest(path.dist));
//        //.pipe(concat("index.js"))
//        //.pipe(rename("index.min.js"))
//});
gulp.task('scripts', function() {
    gulp.src(['./public/js/**/*.js', './public/plug/**/*.js'])
        .pipe(amdOptimize("bootstrap", {
            paths: {
                'angular': "public/libs/angular/angular",
                'domReady': "public/libs/requirejs-domready/domReady",
                'angular-ui-router': "public/libs/angular-ui-router/release/angular-ui-router",
                'ui-bootstrap-tpls': "public/libs/angular-bootstrap/ui-bootstrap-tpls",
                'angular-animate': "public/libs/angular-animate/angular-animate",
                'angular-toastr.tpls': "public/libs/angular-toastr/dist/angular-toastr.tpls",
                'angular-local-storage': "public/libs/angular-local-storage/dist/angular-local-storage",
                'ng-file-upload-all': "public/libs/ng-file-upload/ng-file-upload-all",
                'socket-io': "public/libs/socket.io-client/socket.io",
                'jquery': "public/libs/jquery/dist/jquery",
                'snow': "public/plug/snow/snow"
            },
            shim: {
                'angular': {
                    'deps': ['jquery', 'domReady'],
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
            }
        }))
        .pipe(concat("bootstrap.js"))           //合并
        .pipe(gulp.dest(path.dist + "js"))      //输出保存
        .pipe(ngAnnotate())                     //隐式依赖自动转换成数组标注方式
        // .pipe(rename("bootstrap.js"))           //重命名
        .pipe(uplify())                         //压缩
        .pipe(gulp.dest(path.dist + "js"));     //输出保存
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

// copy
gulp.task('copy:html', function() {
    return gulp.src(['public/**/*.html', '!public/libs/**/*.html'])
               .pipe(minifyHtml())
               .pipe(gulp.dest(path.dist));
});

gulp.task('copy:libs', function() {
    return gulp.src([
                        'public/libs/requirejs/require.js'
                    ])
               .pipe(uplify())
               .pipe(gulp.dest(path.dist + "js"));
});

gulp.task('copy:css', function() {
    return gulp.src([path.css + "**/*.css", 'public/libs/**/*.css'])
               .pipe(concat("app.min.css"))
               .pipe(minifycss())
               .pipe(gulp.dest(path.dist + "css"));
});

gulp.task('copy:img', function() {
    return gulp.src(path.img+ "**/*.*")
               .pipe(gulp.dest(path.dist + "images"));
});

gulp.task('copy:font', function() {
    return gulp.src("public/libs/bootstrap/fonts/*.*")
        .pipe(gulp.dest(path.dist + "fonts"));
});

// clean
gulp.task('clean', function(cb) {
    return rimraf(path.dist, cb);
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
gulp.task('build', gulpSequence('set-production', 'clean', 'scripts', ['copy:html', 'copy:libs', 'copy:css', 'copy:img', 'copy:font'], 'replace'));
