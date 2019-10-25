$(function() {
	$("#btnTrain").click(function() {
		message.confirm("确认预约", "预约培训将扣除培训服务券一张！", null, function(r) {
			if(r) {
				brh.applyService(services.peixun, appType.peixun, services.peixun,
					function(result) {
						message.toast("培训预约成功", 'error');
					},
					function(err) {
						message.toast(err.message, 'error');
					});
			}
		});
	});
});