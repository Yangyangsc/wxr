$(function() {
	var userid = cache.getUserId();
	if(!userid) userid = common.query().userid;
	var goodsid = common.query().gid;
	if(!userid || !goodsid) return alert('页面缺失重要参数，非法加载!');
	ecommerce.getProductDetail(userid, goodsid, function(result) {
		var advImg = [],
			product = result.product;
		if(product.product_image) advImg.push(product.product_image);
		if(product.product_image1) advImg.push(product.product_image1);
		if(product.product_image2) advImg.push(product.product_image2);
		var arrText = doT.template($("#adv_tmpl").text());
		$("#div_adv").html(arrText(advImg));
		var mySwiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			autoHeight: true
		});

		$("#div_richtext").html(product.rich_text);
		$("#p_title").text(product.product_name);
		$("#p_memo").text(product.product_memo);

		var dataflag = {},
			price;
		dataflag.vipprice = "";
		if(product.product_member_price > 0 && product.product_price != product.product_member_price) {
			dataflag.vipprice = product.product_member_price.toFixed(2);
		}

		if(product.product_discount_price > 0 && product.product_discount_price < product.product_price) {
			price = product.product_discount_price.toFixed(2).split(".");
			dataflag.unit = price[0];
			dataflag.dot = price[1];
		} else {
			price = product.product_price.toFixed(2).split(".");
			dataflag.unit = price[0];
			dataflag.dot = price[1];
		}
		var priceTmpl = doT.template($("#price_tmpl").text());
		$("#a_joinvip").before(priceTmpl(dataflag));
		if(product.vip_count == 0) {
			$("#a_joinvip").show();
		}

		var address = result.address;
		if(address) {
			$("#p_addr").text(address.city_name + ">" + address.district_name);
			$("#div_addr").show();
		}

		$("#a_buy").click(function() {
			cache.setCart({
				isvip: product.vip_count > 0 ? 1 : 0,
				products: [{
					id: product.product_id,
					name: product.product_name,
					memo: product.product_memo,
					img: product.product_image,
					vipprice: product.product_member_price,
					saleprice: product.product_discount_price != 0 && product.product_discount_price < product.product_price ? product.product_discount_price : product.product_price,
					buymax: product.buy_max
				}]
			});
			window.location.href = "goods-order.html?&userid=" + userid;
		});
		$("#a_joinvip").click(function() {
			window.location.href = "../membership/index.html?memberid=929906d3-39d2-11e7-812f-f0def1c78a21";
		});
	}, function(err) {

	});
});