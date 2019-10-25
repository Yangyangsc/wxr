
$(function() {

	var userid = cache.getUserId() || common.query().userid;
	if(!userid) return alert('页面缺失重要参数，非法加载!');

	user.getInfo(userid, function(result) {
		$('#spanUserName').text(result.data.user_name);
		$("#imgUserHeader").attr("src", imageServer + common.replace(result.data.user_image, '\\\\', '\/') + "?ran=" + new Date().getTime());
		$('#mobile').html(result.data.user_mobile);
		if(result.data.vip_count > 0)
			$("#a_info").show();
		cache.setUserId(result.data.user_id);
		cache.setUserInfo(result.data);
	}, function(err) {
		message.toast("获取数据失败", 'error');
	});
});