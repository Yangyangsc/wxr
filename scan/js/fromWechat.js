$(function () {
    //如果openid不存在，则跳到活动页
    var openid = common.getCache('openid');
    if (!(!common.isEmpty(common.query().openid) || !common.isEmpty(openid))) {
        //window.location.href = '/index.html'
        return;
    }
})