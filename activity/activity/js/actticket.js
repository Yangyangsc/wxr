$(function() {
	var orderid = common.query().orderid;
	var useid=cache.getUserId()
	var dict = {orderid:orderid,useid:useid}
	activity.getOrderTicket(dict, function(result) {
		if(result.rows && result.rows.length > 0) {
			var arrText = doT.template($("#ticket_tmpl").text());
			$("#by_content").prepend(arrText(result.rows));
			//		alert(JSON.stringify(result));
		}
	}, function(err) {
		message.toast("获取数据失败", 'error');
	})
});