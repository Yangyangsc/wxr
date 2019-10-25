$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';
	$("#btnLogin").click(function() {
		var account = $("#account").val().trim();
		var password = $("#password").val().trim();
		if(!account)
			return message.toast("请输入帐号", 'error');
		if(!password)
			return message.toast("请输入密码", 'error');
		brh.login(account, password, function(result) {
			cache.setBrhUser(result.data[0]);
			var returnUrl = $.getUrlParam("returnUrl");
			if(returnUrl) window.location.href = returnUrl;
			else window.location = "index.html";
		}, function(err) {
			message.toast("用户名或密码错误", 'error');
		})
	});

	$("#btnSee").click(function() {
		if($(this).hasClass("show")) {
			$("#password").attr("type", "password");
		} else {
			$("#password").attr("type", "text");
		}
		$(this).toggleClass("show");
	});
});