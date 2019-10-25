$(function () {
	// var userid = cache.getUserId();
	// if(!userid) userid = common.query().userid;


	// if(common.isEmpty(userid) || common.isEmpty(activityid))
	// 	return alert('页面缺失重要参数，非法加载!');

	// cache.getLocalStorage();



	var catelogid = common.query().cateid || "";
	var silder = common.query().slider;
	var abar = $(".weui-tabbar__item");
	if (catelogid) {
		$("#a_jb").addClass("weui-bar__item_on").siblings().removeClass("weui-bar__item_on");
	} else {
		$("#a_kt").addClass("weui-bar__item_on").siblings().removeClass("weui-bar__item_on");
	}
	//	for(var i = 0; i < abar.length; i++) {
	//		var item = $(abar[i]);
	//		if(item.attr("href").indexOf(catelogid) > 0) {
	//			item.addClass("weui-bar__item_on").siblings().removeClass("weui-bar__item_on");
	//			break;
	//		};
	//	}

	bas.getSliders(silder, 1, function (result) {
		var arrText = doT.template($("#siler_tmpl").text());
		if (result.rows.length == 0) result.rows.push({});
		var innerHTML = arrText(result.rows);
		$("#div_banner").html(innerHTML);
		//		alert(JSON.stringify(result));
		var mySwiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			autoHeight: true
		});
	}, function (err) {
		message.toast("获取数据失败", 'error');
	});

	activity.getActList(catelogid, function (result) {
		if (result.rows && result.rows.length > 0) {
			var arrText = doT.template($("#act_tmpl").text());
			$("#div_actlist").html(arrText(result.rows));
		} else {
			$("#div_nodata").show();
		}
	}, function (err) {
		message.toast("服务器繁忙，请稍后重试", 'error');
	});
});