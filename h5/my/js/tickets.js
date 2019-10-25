$(function() {
	cache.getLocalStorage()

	var userid = cache.getUserId();
	if(common.isEmpty(userid)) {
		return alert("页面缺少重要参数！");
	}

	activity.getActOrders({
		uid: userid,
		page: 1,
		rows: 100
	}, function(result) {
		if(result.rows && result.rows.length > 0) {
			var arrText = doT.template($("#actorder_tmpl").text());
			$("#div_orders").show().html(arrText(result.rows));
			$(".showticket").click(function(e) {
				window.location.href = "../activity/activity-ticket.html?orderid=" + this.getAttribute("orderid");
			});
		} else {
			$("#div_nodata").show();
		}
	}, function(err) {
		message.toast("获取数据失败", 'error');
	});
});