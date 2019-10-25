var wechatOAuth = function() {
	window.location.href = apiServer + "wechat/oauth?scope=1&url=" + window.location.href
}

var get_activity = function(id, options) {
	options.onSuccess = options.onSuccess || function() {};
	apiCaller.call('/activitys/' + id, {
		type: 'get',
		success: function(res) {
			if(res.successed) {
				options.onSuccess(res);
			} else {
				weui.topTips('太忙了..客观等一会吧');
			}
		},
		error: function(xhr, type) {
			weui.topTips('太忙了..客观等一会吧');
		}
	})
}
var activity_enroll = function(data, options) {
	options.onSuccess = options.onSuccess || function() {};

	var userid = sessionStorage.getItem("userid");
	var channelid = sessionStorage.getItem("channelid");
	var ticketid = sessionStorage.getItem("ticketid");

	apiCaller.call('orders', {
		type: 'post',
		data: {
			userid: userid,
			ticketid: ticketid,
			total: 1,
			mobile: data.mobile,
			enrolljson: JSON.stringify(data)
		},
		success: function(res) {
			if(res.successed) {
				options.onSuccess(res);
			} else {
				weui.topTips('太忙了..客观等一会吧');
			}
		},
		error: function(xhr, type) {
			if(xhr.error)
				weui.topTips(xhr.message);
			else
				weui.topTips('太忙了..客观等一会吧');
		}
	})
}