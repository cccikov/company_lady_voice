var bottom_template = 
'<div class="footer">'+
    '<a :class="{active:footer==\'index\'}" href="index.html">首页</a>'+
    '<a :class="{active:footer==\'overhear\'}" href="overhear.html">偷听</a>'+
    '<a :class="{active:footer==\'msg\'}" href="msg.html">消息</a>'+
    '<a :class="{active:footer==\'find\'}" href="find.html">发现</a>'+
    '<a :class="{active:footer==\'me\'}" href="me.html">我的</a>'+
'</div>'

Vue.component('bottom', {
    template: bottom_template,
    data:function(){
        return {
            footer:null
        }
    },
    mounted:function(){
        var _this = this;
        _this.$nextTick(function(){
            _this.footer = getPath();
        });
    }
});

function getPath(){
    var path = document.location.pathname;
    var reg = /\/(\w+?).html/;
    var result = path.match(reg);
    if(!!result){
        return result[1];
    }else{
        return ""
    }
}