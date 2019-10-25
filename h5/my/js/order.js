$(function() {
	var userid = cache.getUserId();
	if(!userid) userid = common.query().userid;
	if(!userid) return alert('页面缺失重要参数，非法加载!');
	ecommerce.getOrderList(userid, function(result) {
		if(result.rows && result.rows.length > 0) {
			var arrText = doT.template($("#order_tmpl").text());
			$("#div_orders").show().html(arrText(result.rows));
		} else {
			$("#div_nodata").show();
		}
	}, function(err) {
		message.toast("获取数据失败", 'error');
	});
});