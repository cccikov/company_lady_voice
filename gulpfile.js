let gulp = require('gulp');
let less = require('gulp-less'); //
let minicss = require("gulp-clean-css");
let rename = require("gulp-rename");
let imagemin = require('gulp-imagemin');
let pngquant = require('imagemin-pngquant');
let cache = require("gulp-cache");
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;

/* less转换路径 */
let lessBasePath = "./less/"; // 这里需要设置base为lessPath的glob前面字符串 , 就算是"只转换修改的less文件方式"也不怕写入路径有问题了.但是这样如果lessPath是一个数组的时候就不行了 , 所以还是要搞一个任务,是装换后css就放在源less的所在文件夹
let lessPath = lessBasePath + "**/*.less"; // 需要装换less路径 其实就是./less/**/*.less
let less2cssPath = "./css/"; // less装换css后存放路径


/* css压缩路径 */
let cssPath = "./css/*.css"; // 需要压缩的css路径
let css2miniPath = "./css"; // 压缩后的css路径


/* 图片压缩路径 */
let imgPath = "./images/**/*.{png,jpg,gif,ico}"; // 需要压缩的img路径
let img2miniPath = "./img"; // 压缩后的img路径


/* 同步监视路径 */
let browserSyncPath = ["./**/*.html", "./css/*.css", "./js/*.js"]; // 监视同步路径
let browserSyncWithoutCssPath = ["./**/*.html", "./js/*.js"]; // 监视路径不要css


/* 服务器方面 */
let browserSyncRootPath = "./web";
let browserSyncIndex = "index.html"; // 服务器启动的时候,默认打开的文件

function lessFn(path, base, destPath) { // 只有path是event.path的时候才可以忽略destPath
    return gulp.src(path, {
            base: base
        })
        .pipe(less())
        .pipe(gulp.dest(destPath)); // 返回流,调用后在返回值后面再流的操作
}

function isFile(path) { //node fs模块也有这个方法 但是是根据文件去判断的吧 我这个是根据路径去判断
    let path_separator = path.includes("\\") ? "\\" : "/"; // 路径分隔符 windows 是"\" , linux是"/"
    let pathArr = path.split(path_separator);
    let arrLen = pathArr.length;
    if (pathArr[arrLen - 1] == "") { //因为如果是文件夹的话是以\结尾 , 那么数组的最后一个就为 ""
        return false
    }
    return true;
}

function lesskoala(path) { // 类似考拉那样 , less转换后的css就保存在所在文件夹 , path只能用event.path
    let path_separator = path.includes("\\") ? "\\" : "/"; // 路径分隔符 windows 是"\" , linux是"/"
    destPath = path.split(path_separator).slice(0, -1).join("/"); // 如果path是event.path,写入文件路径就是被读取文件的当前文件夹
    return gulp.src(path)
        .pipe(less())
        .pipe(gulp.dest(destPath)); // 返回流,调用后在返回值后面再流的操作
}

function synclessFn(path, base, destPath) { // 用于浏览器同步刷新 , 先转less , 然后reload
    lessFn(path, base, destPath).pipe(browserSync.reload({
        stream: true
    }));
}

/**
 * default 任务
 */
gulp.task('default', ["less", "syncLess2"], function () {
    console.log("********\n执行了 less & syncLess2\n********");
});



/**
 * 转换less
 */

// 转换全部less
gulp.task("less", function () {
    lessFn(lessPath, lessBasePath, less2cssPath);
});

// 自动编译less
gulp.task("autoLess", function () {
    gulp.watch(lessPath, ['less']) // 后面的任务不要是监视任务,是一次性任务(任务里面没有watch),否则就会出现好多重监视
});

//"只转换修改的less文件方式" 这个是只会去转换修改的那个文件 , 而不会转换全部less , 减少性能消耗. 考拉就是单个装换
gulp.task("autoOneLess", function () {
    gulp.watch(lessPath).on('change', function (event) {
        lessFn(event.path, lessBasePath, less2cssPath);
    });
});

// koala式转换less
gulp.task("koala", function () {
    gulp.watch(lessPath).on('change', function (event) {
        if (isFile(event.path)) {
            lesskoala(event.path);
        } else {
            console.log(event.path + "是文件夹不作处理!!!");
        }
    });
});



/**
 * 压缩css
 */
// minicss
gulp.task("minicss", function () {
    gulp.src(cssPath)
        .pipe(minicss())
        // .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(css2miniPath));
});

// less & minicss
gulp.task("lessmini", function () {
    lessFn(lessPath, lessBasePath, less2cssPath)
        .pipe(minicss())
        // .pipe(rename({ suffix: '.min' })) //重命名
        .pipe(gulp.dest(css2miniPath));
});



/**
 * browser-sync
 */
// 静态服务器
gulp.task('server', function () {
    browserSync.init({
        server: browserSyncRootPath
    });
});

// 浏览器同步
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });
    gulp.watch(browserSyncPath).on("change", function (event) {
        gulp.src(event.path).pipe(browserSync.reload({
            stream: true
        }));
    });
});



/**
 * 浏览器同步 同时 转换less
 */
// 方式1 实际监视的是css , "只转换修改的less文件方式" 只是less转换的时候触发css变化(可能不能用全部转换方法,只能用哪个less变化就装换哪个)
gulp.task('syncLess', function () {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });

    // 转换less
    gulp.watch(lessPath).on('change', function (event) {
        lessFn(event.path, lessBasePath, less2cssPath);
    });
    // 监视文件变化同步浏览器
    gulp.watch(browserSyncPath).on("change", function (event) {
        gulp.src(event.path).pipe(browserSync.reload({
            stream: true
        }));
    });
});





// 方式2 监视的是less , 转换后 reload
gulp.task('syncLess2', function () {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });
    // 转换less 并刷新 "只转换修改的less文件方式"
    gulp.watch(lessPath).on('change', function (event) {
        synclessFn(event.path, lessBasePath, less2cssPath);
    });
    // 监视文件变化同步浏览器
    gulp.watch(browserSyncWithoutCssPath).on("change", function (event) {
        gulp.src(event.path).pipe(browserSync.reload({
            stream: true
        }));
    });
});










// koala式less转换后的css就保存在所在文件夹
gulp.task('syncKoala', function () {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });
    // 转换less
    gulp.watch(lessPath).on('change', function (event) {
        if (isFile(event.path)) {
            lesskoala(event.path)
                .pipe(browserSync.reload({
                    stream: true
                }));
        } else {
            console.log(event.path + "是文件夹不作处理!!!");
        }
    });
    // 监视文件变化同步浏览器
    gulp.watch(browserSyncWithoutCssPath).on("change", function (event) {
        gulp.src(event.path).pipe(browserSync.reload({
            stream: true
        }));
    });
});


































/**
 * 压缩图片
 */
gulp.task('imgmin', function () {
    gulp.src(imgPath)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(img2miniPath));
});
gulp.task('imgmincache', function () {
    gulp.src(imgPath)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(img2miniPath));
});



/* 清除 gulp-cache 的缓存 */
gulp.task('clear', function (done) {
    return cache.clearAll(done);
});



gulp.task('web_syncless', function () {

    browserSync.init({
        server: {
            baseDir: "./web",
            index: "index.html"
        },
        port: 3000,
        ui: {// ui的默认端口
            port: 3001,
            weinre: { // 不知道什么鬼 "weinre"好像也是用于远程调试的nodejs工具
                port: 3002
            }
        }
    });

    // 转换less
    gulp.watch("./less/**/*.less").on('change', function (event) {
        gulp.src("./less/**/*.less", { // 这个是全部css变化且刷新
                base: "./less"
            })
            .pipe(less())
            .pipe(gulp.dest("./css"))
            .pipe(browserSync.reload({
                stream: true
            }));;
    });

    // 监视文件变化同步浏览器
    gulp.watch(["./**/*.html", "./js/*.js"]).on("change", function (event) {
        gulp.src(event.path).pipe(browserSync.reload({
            stream: true
        }));
    });

});
