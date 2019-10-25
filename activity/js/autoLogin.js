
var userid = common.query().userid || cache.getUserId();
if(!userid) {
	var url = window.location.href;
	url += url.indexOf("?") < 0 ? "?" : "&";
	var haduser = common.query().haduser;
	if(typeof haduser == "undefined") {
		window.location.href = wechatAuth + '?url=' + url + "checkuser=1";
	} else if(haduser == 0) {
		window.location.href = wechatAuth + '?url=' + url + "scope=1";
	}
} else {
	cache.setUserId(userid);
	// 移除url中的userid 避免用户直接复制链接分享给他人造成携带用户信息
	if(common.query().userid)
		window.location.href = common.removeUrlParams(common.removeUrlParams(common.removeUrlParams(common.removeUrlParams(window.location.href, "userid"), "token"), "haduser"), "checkuser");
}
