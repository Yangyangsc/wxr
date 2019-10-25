$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';

	$("#btnSure").click(function() {
		var password = $("#password").val().trim();
		var newpassword = $("#newpassword").val().trim();
		var confirmpassword = $("#confirmpassword").val().trim();
		if(!password || !newpassword || !confirmpassword) {
			return message.toast("请输入旧密码/新密码/确认新密码", 'error');
		}
		if(newpassword != confirmpassword) return message.toast("新密码跟确认密码不一致", 'error');
		if(newpassword.length < 6) return message.toast("密码长度不能小于6位", 'error');
		brh.updatePassword(password, newpassword, function(result) {
			message.toast("密码修改成功", 'error');
			setTimeout(function() {
				window.location.href = "../profile.html";
			}, 500);
		}, function(err) {
			message.toast("密码修改失败，请稍后再试", 'error');
		})
	});
});