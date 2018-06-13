window.onload = function() {
    new Vue({
        el: "#wrap",
        data: {
            show_mark: false,
            show_action: -1
        },
        mounted: function() {
            var _this = this;
            _this.$nextTick(function() {
                maskNoScroll();
            });
        },
        methods: {
            show: function(num) {
                var _this = this;
                _this.show_mark = true;
                _this.show_action = num;
            },
            hide: function() {
                var _this = this;
                _this.show_mark = false;
                _this.show_action = -1;
            }
        }
    });
}