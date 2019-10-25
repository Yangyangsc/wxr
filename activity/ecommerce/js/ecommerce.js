$(function() {
	bas.getSliders("mall-top", 1, function(result) {
		var arrText = doT.template($("#siler_tmpl").text());
		if(result.rows.length == 0) result.rows.push({});
		var innerHTML = arrText(result.rows);
		$("#div_banner").html(innerHTML);
		//		alert(JSON.stringify(result));
		var mySwiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			autoHeight: true
		});
	}, function(err) {
		message.toast("获取数据失败", 'error');
	})

	ecommerce.getProducts(1, 20, function(result) {
		var arrText = doT.template($("#goods_tmpl").text());
		var innerHTML = arrText(result.data);
		$("#ul_goodsls").html(innerHTML);
		var $goodsItems = document.querySelectorAll('.goods-item');
		[].forEach.call($goodsItems, function(ele) {
			var thumbnail = ele.querySelector('.thumbnail')
			var img = ele.querySelector('.thumbnail img')
			thumbnail.style.backgroundImage = 'url(' + img.src + ')'
		});
	}, function(err) {
		message.toast("获取数据失败", 'error');
	})
});