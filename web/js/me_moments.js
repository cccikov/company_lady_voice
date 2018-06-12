window.onload = function() {
    new Vue({
        el: "#wrap",
        data: {
            show_mark: false
        },
        mounted: function() {
            var _this = this;
            _this.$nextTick(function() {
                maskNoScroll();
            });
        },
        methods: {
            show: function() {
                var _this = this;
                _this.show_mark = true;
            },
            hide: function() {
                var _this = this;
                _this.show_mark = false;
            }
        }
    });
}