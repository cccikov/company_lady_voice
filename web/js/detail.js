window.onload = function() {
    vm = new Vue({
        el: "#wrap",
        mounted: function() {
            var _this = this;
            _this.$nextTick(function() {
                new Swiper(".swiper",{
                    slidesPerView:"3",
                    spaceBetween:6,
                    // freeMode:true
                });
            });
        }
    });
}


