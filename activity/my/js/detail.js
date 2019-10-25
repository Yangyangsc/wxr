$(function() {
	userid = cache.getUserId();
	if(!userid) return alert("缺少重要参数！");
	user.getInfo(userid, function(result) {
		if(result.data) {
			var arrText = doT.template($("#info_tmpl").text());
			$("body").html(arrText(result.data));
		}
		$("#btn_save").click(function(e) {
			var userlogo = $("#userlogo").val();
			var mobile = $("#mobile").val().trim();
			var username = $("#username").val().trim();
			var realname = $("#realname").val().trim();
			var sex = $("input[name='sex']:checked").val();
			var corpname = $("#corpname").val().trim();
			var corpposition = $("#corpposition").val().trim();

			if(!mobile || !common.isMobileNo(mobile))
				return message.toast("请填写正确的手机号码", 'error');
			if(!username)
				return message.toast("昵称不能为空", 'error');
			if(!realname)
				return message.toast("请填写真实姓名", 'error');
			if(!corpname)
				return message.toast("请填写工作单位", 'error');

			user.editUserInfo({
				userlogo: userlogo,
				mobile: mobile,
				username: username,
				realname: realname,
				sex: sex,
				corpname: corpname,
				corpposition: corpposition,
				userid: userid
			}, function(result) {
				alert("保存成功！");
				window.history.go(-1);
			}, function(err) {
				message.toast("信息保存失败，请稍后重试", 'error');
			});
		});
		$("#uploaderInput").on("change", function(e) {
			var url = window.URL || window.webkitURL || window.mozURL,
				file = e.target.files[0];
			bas.uploadFile("userlogo", file, function(fresult) {
				var rdata = JSON.parse(fresult.target.response)[0];
				if(rdata && rdata.path) $("#userlogo").val(rdata.path);
				if(url) {
					src = url.createObjectURL(file);
				} else {
					src = e.target.result;
				}
				$("#user_logo").attr("src", src);
			}, function(err) {
				message.toast("上传头像失败", 'error');
			});
		});
	}, function(err) {
		message.toast("获取数据失败", 'error');
	});
});