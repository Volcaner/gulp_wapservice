var gulp = require('gulp')
var g = require('gulp-load-plugins')()

var combiner = require('stream-combiner2')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload

var handleError = function (err) {
    var colors = g.util.colors;
    console.log('\n')
    g.util.log(colors.red('Error!'))
    g.util.log('fileName: ' + colors.red(err.fileName))
    g.util.log('lineNumber: ' + colors.red(err.lineNumber))
    g.util.log('message: ' + err.message)
    g.util.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('fileinclude', function() {
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    var combined = combiner.obj([
        gulp.src(['src/html/*.html', 'widgets/html/*.html']),
        g.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }),
        g.htmlmin(options),
        gulp.dest('dist/html')
    ])
    combined.on('error', handleError)
});

gulp.task('watchfileinclude', function () {
    gulp.watch(['src/html/*.html', 'widgets/html/*.html'], ['fileinclude']);
});

gulp.task('watchtemplate', function () {
    gulp.watch('src/template/*.html', ['fileinclude']);
});

gulp.task('js', function () {
    var combined = combiner.obj([
        gulp.src(['src/js/*.js', 'widgets/js/*.js']),
        g.uglify(),
        gulp.dest('dist/js/')
    ])
    combined.on('error', handleError)
})

gulp.task('watchjs', function () {
    gulp.watch(['src/js/*.js', 'widgets/js/*.js'], ['js']);
})

gulp.task('image', function () {
    var combined = combiner.obj([
        gulp.src(['src/images/*.*', 'widgets/images/*.*']),
        g.imagemin({
            progressive: false,
            optimizationLevel: 5,
        }),
        gulp.dest('dist/images')
    ])
    combined.on('error', handleError)
})

gulp.task('watchimage', function () {
    gulp.watch(['src/images/*.*', 'widgets/images/*.*'], ['image']);
})

gulp.task('less', function () {
    var combined = combiner.obj([
            gulp.src(['src/less/*.less', 'widgets/less/*.less']),
            g.autoprefixer({
              browsers: 'last 2 versions'
            }),
            g.less(),
            g.px3rem({
                baseDpr: 2,
                threeVersion: false,
                remVersion: true,
                remUnit: 46.875,
                remPrecision: 6
            }),
            g.minifyCss(),
            gulp.dest('dist/css/')
        ])
    combined.on('error', handleError)
})

gulp.task('watchless', function () {
    gulp.watch(['src/less/*.less', 'widgets/less/*.less'], ['less'])
})

// browser-sync
gulp.task('browser-sync', function()  {
    browserSync.init({
        server: { baseDir: "./" } ,
        port: 8888,
        notify: true,
    });

    gulp.watch("dist/html/*.html").on('change', reload);
    gulp.watch("dist/css/*.debug.css").on('change', reload);
    gulp.watch("dist/js/*.js").on('change', reload);
    gulp.watch("dist/images/*.*").on('change', reload);
});

// hot
gulp.task('hot', function() {  
    g.livereload.listen();
    gulp.watch('dist/**/*.*', function(event) {  
        g.livereload.changed(event.path);  
    });  
}); 

gulp.task('connect', function () {
    g.connect.server({
        root: './',
        livereload: true,
        port: 8888,
        host: '192.168.0.169',
    });
})

gulp.task('default', [
    // build
    'fileinclude', 'js', 'image', 'less', 
    // watch
    'watchfileinclude', 'watchtemplate', 'watchjs', 'watchimage', 'watchless', 
    // server
    // 'connect', 'hot',
    // 'browser-sync',
    ]
)
