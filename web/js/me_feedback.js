window.onload = function() {
    new Vue({
        el: "#wrap",
        mounted:function(){
            var _this = this;
            _this.$nextTick(function(){
                autoTextarea(document.getElementsByTagName("textarea")[0],0)
            });
        }
    });
}