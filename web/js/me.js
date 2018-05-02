window.onload = function() {
    new Vue({
        el: "#wrap",
        data:{
            overhear:true
        },
        methods:{
            isOverhear:function(){
                this.overhear = !this.overhear;
            }
        },
        mounted:function(){
            var _this = this;
            _this.$nextTick(function(){
            });
        }
    });
}