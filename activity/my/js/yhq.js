$(function () {
	var userid = cache.getUserId();
	if (common.isEmpty(userid)) {
		return alert("页面缺少重要参数！");
	}

	$("#div_button").click(function (e) {
		$("#load1").show()
		var edit_yhq = $("#yhq_input").val()
		console.log(edit_yhq)
		activity.edityhq({
			uid: userid,
			page: 1,
			rows: 100,
			yhq: edit_yhq
		}, function (res) {
			$("#load1").hide()
		}, function (err) {
			console.log(err)
		})
	})

	activity.getYhq({
		uid: userid,
		page: 1,
		rows: 100
	}, function (result) {
		if (result.rows.yhq) {
			$("#yhq_input").val(result.rows.yhq)
		} else {
			$("#div_nodata").show();
			$("#div_button").hide()
		}
	}, function (err) {
		message.toast("获取数据失败", 'error');
	});
});