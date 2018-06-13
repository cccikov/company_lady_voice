window.onload = function () {
    new Vue({
        el: "#wrap",
        data: {
            payment_mode: "zhifubao", //支付方式
        },
        mounted: function () {
            var _this = this;
            _this.$nextTick(function () {});
        },
        methods: {
            recharge: function (val) {
                alert("测试：" + this.payment_mode + "支付" + val);
            },
            change: function (str) {
                this.payment_mode = str;
            }
        }
    });
}