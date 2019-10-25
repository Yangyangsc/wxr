$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';
	brh.getApplys(function(result) {
			console.log(result)
			var arrText = doT.template($("#app_temp").text());
			var innerHTML = arrText(result.data);
			$("#app_list").html(innerHTML);
		},
		function(err) {
			message.toast("获取数据失败", 'error');
		});

})