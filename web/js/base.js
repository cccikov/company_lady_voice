var bottom_template =
    '<div class="footer">' +
    '<a :class="{active:footer==\'index\'}" href="index.html">首页</a>' +
    '<a :class="{active:footer==\'overhear\'}" href="overhear.html">偷听</a>' +
    '<a :class="{active:footer==\'msg\'}" href="msg.html">消息</a>' +
    '<a :class="{active:footer==\'find\'}" href="find.html">发现</a>' +
    '<a :class="{active:footer==\'me\'}" href="me.html">我的</a>' +
    '</div>';

Vue.component('bottom', {
    template: bottom_template,
    data: function() {
        return {
            footer: null
        }
    },
    mounted: function() {
        var _this = this;
        _this.$nextTick(function() {
            var path = getPath();
            _this.footer = path || "index";
        });
    }
});

function getPath() {
    var path = document.location.pathname;
    var reg = /\/(\w+?).html/;
    var result = path.match(reg);
    if (!!result) {
        return result[1];
    } else {
        return ""
    }
}

function swiper_build(slidesPerView) {
    var nav_slides; // nav 的 slides
    var nav_width; // nav 的 container 宽度，即nav的可视宽度
    var nav_wrapper_width; // nav 的 wrapper 内容宽度
    var nav_first_slide_width; // nav 的第一个 slide 宽度
    var nav_slides_width_arr = []; // nav 每个slides的宽度
    var nav_slides_position_arr = []; // nav 每个slides的偏移
    var nav_swiper_position_arr = []; // nav 每个slides active时 swiper 的偏移
    var bar; // 滑块
    var bar_max_translate; // 滑块最大移动距离
    var speed = 300; // 触摸滑动时释放至贴合的时间 , 也是全局过渡效果的过渡时间

    var active_color = [141, 102, 255]; // 活动颜色 rgba
    var normal_color = [124, 124, 124]; // 活动颜色 rgba

    var nav_swiper = new Swiper(".nav", {
        slidesPerView: slidesPerView,
        freeMode: true,
        on: {
            init: function() {
                nav_width = parseInt(this.$el.css("width"));

                nav_wrapper_width = this.$wrapperEl[0].scrollWidth;

                nav_slides = this.slides;
                nav_first_slide_width = parseInt(nav_slides.eq(0).css("color", "rgb(" + active_color[0] + "," + active_color[1] + "," + active_color[2] + ")").css("width"));

                for (var i = 0, len = nav_slides.length; i < len; i++) {
                    // 获取 nav 每个slides的宽度
                    nav_slides_width_arr.push(parseInt(nav_slides.eq(i).css("width")));

                    // 获取 nav 每个slides的偏移
                    nav_slides_position_arr.push(nav_slides[i].offsetLeft);

                    //  获取 nav 每个slides active时 swiper 的偏移
                    var key_distance = nav_width / 2 - nav_slides_width_arr[i] / 2; // 关键距离
                    var active_nav_position = nav_slides[i].offsetLeft
                    if (active_nav_position < key_distance) {
                        var nav_wrapper_translate = 0;
                    } else if (active_nav_position > nav_wrapper_width - (key_distance + nav_slides_width_arr[i])) {
                        var nav_wrapper_translate = -(nav_wrapper_width - nav_width); // // 由于是向左 ； 所以是负数
                    } else {
                        var nav_wrapper_translate = -(active_nav_position - key_distance); // // 由于是向左 ； 所以是负数
                    }
                    nav_swiper_position_arr.push(nav_wrapper_translate);
                }

                bar_max_translate = nav_slides[nav_slides.length - 1].offsetLeft;

                bar = this.$el.find(".bar"); // 获取滑块dom
                bar.css("width", (nav_first_slide_width - 20) + "px").find(".bar-color").css("background", "rgb(" + active_color[0] + "," + active_color[1] + "," + active_color[2] + ")"); // 设置滑块宽度
            }
        }
    });




    var page_swiper = new Swiper(".page", {
        speed: speed,
        resistanceRatio: 0,
        watchSlidesProgress: true,
        on: {

            // 过渡效果开始时 , 滑动松手时 , 或者手动设置切换到指定slide
            transitionStart: function() {
                var active_page_index = this.activeIndex; // 当前活动块的索引
                var active_nav_position = nav_slides[active_page_index].offsetLeft; // 对应的nav应该活动的块的距离wrapper的位置


                // 设置滑块偏移量以及宽度
                bar.transition(speed); // 在touchMove的时候要设置为0 ; 否则会有延迟的感觉
                bar.css({
                    "width": (nav_slides_width_arr[active_page_index] - 20) + "px",
                    'transform': "translate(" + active_nav_position + "px , 0px)"
                });

                // 设置nav slide 颜色
                nav_slides.eq(active_page_index).transition(speed); // // 在touchMove的时候要设置为0 ; 否则会有延迟的感觉
                nav_slides.eq(active_page_index + 1).transition(speed);
                nav_slides.eq(active_page_index - 1).transition(speed);
                nav_slides.eq(active_page_index).css("color", "rgb(" + active_color[0] + "," + active_color[1] + "," + active_color[2] + ")");
                nav_slides.eq(active_page_index + 1).css("color", "rgb(" + normal_color[0] + "," + normal_color[1] + "," + normal_color[2] + ")"); // rgb(153,153,153) 就是 #999
                nav_slides.eq(active_page_index - 1).css("color", "rgb(" + normal_color[0] + "," + normal_color[1] + "," + normal_color[2] + ")");

                // nav slide活动块居中

                nav_swiper.setTransition(speed);
                nav_swiper.setTranslate(nav_swiper_position_arr[active_page_index]);
            },


            // 手指触摸移动滑块的时候
            touchMove: function(e) {

                var page_swiper_progress = this.progress; // page的progress

                var active_page_index = this.activeIndex; // 当前活动块的索引
                var active_page_slide_progress = this.slides[active_page_index].progress; // 活动块的progress 只要 超过 -0.5 或者 0.5 ； 下一次touchMove的活动块索引就会变
                // console.log(active_page_slide_progress, active_page_index); // 只要 超过 -0.5 或者 0.5 ； 下一次touchMove的活动块索引就会变


                /**
                 * 其实实时变化都是使用一个原理 --- 初始值加上变化量 = 初始值 + (未来值 - 初始值)*变化率
                 */


                // 设置滑块的宽度
                bar.transition(0);
                // 当前slide的宽度 + (未来slide的宽度-当前slide的宽度) * 变化率 = 当前slide的宽度 * (1-变化率) + 未来slide的宽度 * 变化率             --变化率为正数
                // 当前加上变化量                                             = 以前占比 + 未来占比
                if (active_page_slide_progress > 0) {
                    var bar_width = nav_slides_width_arr[active_page_index] + (nav_slides_width_arr[active_page_index + 1] - nav_slides_width_arr[active_page_index]) * active_page_slide_progress;
                    bar.css("width", (bar_width - 20) + "px");
                } else if (active_page_slide_progress < 0) {
                    var bar_width = nav_slides_width_arr[active_page_index] - (nav_slides_width_arr[active_page_index - 1] - nav_slides_width_arr[active_page_index]) * active_page_slide_progress; // 由于active_page_slide_progress是负数 所以用减
                    bar.css("width", (bar_width - 20) + "px");
                }


                // 设置滑块偏移
                if (active_page_slide_progress > 0) {
                    var bar_position = nav_slides_position_arr[active_page_index] + (nav_slides_position_arr[active_page_index + 1] - nav_slides_position_arr[active_page_index]) * active_page_slide_progress;
                    bar.css("transform", "translate(" + bar_position + "px , 0px)");
                } else if (active_page_slide_progress < 0) {
                    var bar_position = nav_slides_position_arr[active_page_index] - (nav_slides_position_arr[active_page_index - 1] - nav_slides_position_arr[active_page_index]) * active_page_slide_progress; // 由于active_page_slide_progress是负数 所以用减
                    bar.css("transform", "translate(" + bar_position + "px , 0px)");
                }



                // nav 颜色切换
                for (var i = 0, len = this.slides.length; i < len; i++) {
                    var page_slide_progress_abs = Math.abs(this.slides[i].progress); // 当前活动slides为0 , 上一个为1 , 下一个为-1 ; 先左滑动时 , slide的progress加大 ;
                    if (page_slide_progress_abs < 1) { // 滑动的时候只有两个slides的progress的绝对值少于1 , 一个是活动块 , 一个是将要成为活动块

                        //slide progress 绝对值为 0 的时候颜色是255,72,145 ; 1 的时候颜色为153,153,153
                        var rate = Math.pow(page_slide_progress_abs, 1.8); // page_slide_progress_abs的变化是0-1 ; 那么他的指数也是0-1 ;  如果指数大于1 , 那么在红色的情况会多一点 (小数的平方会更小) ; 增加指数后 , 变化不再是平滑 , 效果更佳好看
                        var r = Math.floor(active_color[0] + (normal_color[0] - active_color[0]) * rate); // 初始值加上变化量
                        var g = Math.floor(active_color[1] + (normal_color[1] - active_color[1]) * rate); // 记住一定要加上 Math.floor 因为rgba只接受整数
                        var b = Math.floor(active_color[2] + (normal_color[2] - active_color[2]) * rate);

                        nav_slides.eq(i).transition(0);
                        nav_slides.eq(i).css("color", "rgb(" + r + "," + g + "," + b + ")");
                    }
                }


                // nav slide活动块居中
                nav_swiper.setTransition(0);
                if (active_page_slide_progress > 0) {
                    var nav_wrapper_position = nav_swiper_position_arr[active_page_index] + (nav_swiper_position_arr[active_page_index + 1] - nav_swiper_position_arr[active_page_index]) * active_page_slide_progress;
                    nav_swiper.setTranslate(nav_wrapper_position);
                } else if (active_page_slide_progress < 0) {
                    var nav_wrapper_position = nav_swiper_position_arr[active_page_index] - (nav_swiper_position_arr[active_page_index - 1] - nav_swiper_position_arr[active_page_index]) * active_page_slide_progress; // 由于active_page_slide_progress是负数 所以用减
                    nav_swiper.setTranslate(nav_wrapper_position);
                }
                // 上面的transitionStart也要同时设置 , 因为太用力滑动 ; 可能page翻过去几页 , 但是touchMove的时候的active_page_index还是触摸的那页 ; 就会导致居中出问题


            }
        }
    });


    // nav_swiper.$el.on('touchstart', function(e) {
    //     e.preventDefault(); //去掉按压阴影
    // })

    // 点击导航的时候
    nav_swiper.on('tap', function(e) {
        var click_index = this.clickedIndex;
        var click_slide = this.slides.eq(click_index);
        page_swiper.slideTo(click_index, speed);
        this.slides.css("color", "rgb(" + normal_color[0] + "," + normal_color[1] + "," + normal_color[2] + ")");
        click_slide.css("color", "rgb(" + active_color[0] + "," + active_color[1] + "," + active_color[2] + ")");
    });
}


function maskNoScroll() { // 蒙层后面内容不能翻滚
    document.getElementById("mark").addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
}


function autoTextarea(obj,paddingHeight){
    obj.style.overflow="hidden";
    obj.oninput = function(){
        obj.style.height = "auto";
        obj.style.height = (obj.scrollHeight-paddingHeight) + "px";

    }
    obj.onpropertychange = function(){
        obj.style.height = "auto";
        obj.style.height = (obj.scrollHeight-paddingHeight) + "px";
    }
}