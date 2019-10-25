$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';
	var user = cache.getBrhUser();
	if(!user) return window.location.href = "login.html";
	$("#userName").text(user.name);
	$("#s_joindate").text(user.join_date);
	if(user.logo) $("#img_head").attr("src", imageServer + common.replace(user.logo, '\\\\', '\/'))

	brh.getMyServices(function(result) {
			var arrText = doT.template($("#svc_temp").text());
			$("#s_total").text(result.apply_total);
			var innerHTML = arrText(result.data);
			$("#slist").html(innerHTML);
		},
		function(err) {
			message.toast("获取数据失败", 'error');
		});
});