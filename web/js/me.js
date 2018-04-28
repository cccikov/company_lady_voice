window.onload = function() {
    new Vue({
        el: "#wrap",
        data:{
            overhear:true
        },
        methods:{
            isOverhead:function(){
                this.overhead = !this.overhead;
            }
        },
        mounted:function(){
            var _this = this;
            _this.$nextTick(function(){
            });
        }
    });
}