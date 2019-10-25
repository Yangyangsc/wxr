$(function() {
	var products = cache.getCart();
	if(!products) {
		window.location.href = "../ecommerce.html";
	}
	var arrText = doT.template($("#prd_tmpl").text());
	products.youhui = 0;
	$("#div_products").html(arrText(products));

	changeTotal();
	var userid = cache.getUserId();
	if(!userid) userid = common.query().userid;

	//减少
	$('.reduce').click(function(e) {
		var numEle = this.nextSibling;
		if(numEle.value <= 1) return e.value = 1;
		numEle.value--;
		changeTotal();
	});

	//增加
	$(".increase").click(function(e) {
		var numEle = this.previousSibling;
		var max = numEle.getAttribute("max");
		if(max != 0 && Number(numEle.value) >= Number(max)) {
			message.toast("购买数量不能大于" + max, 'error');
			return numEle.value = max;
		}
		numEle.value++;
		changeTotal();
	});

	function changeTotal() {
		var numEles = document.getElementsByClassName("goodscount");
		var totalPrice = 0;
		for(var i = 0; i < numEles.length; i++) {
			totalPrice += numEles[i].getAttribute("price") * numEles[i].value;
		}
		if(totalPrice > 0) totalPrice = (totalPrice + 8);
		totalPrice = totalPrice.toFixed(2).split(".");
		$("#sp_totalunit").text(totalPrice[0]);
		$("#sp_totaldot").text(totalPrice[1]);
	};

	$("#a_addaddr").click(function(e) {
		if($("#div_addrlist").children().length >= 5)
			return alert("地址数量已超过限制，请删除后再添加");
		window.location.href = "../my/address-detail.html";
	});

	user.getAddressList(userid, function(result) {
		if(result.data.length > 0) {
			var arrText = doT.template($("#addr_tmpl").text());
			$("#div_addrlist").html(arrText(result.data));
		}
	}, function(err) {

	});

	$("#a_buy").click(function(e) {
		var checkRd = $("input[name='raddr']:checked");
		if(checkRd.length == 0)
			return message.toast("请选择收获地址", 'error');
		var receiveinfo = checkRd.attr("addrinfo");
		var productid = $("#productid").attr("pid");
		var ordercount = $("#goodscount").val();
		if(ordercount < 1)
			return message.toast("请选择商品数量", 'error');
		ecommerce.makeOrder({
			userid: userid,
			productid: productid,
			ordercount: ordercount,
			receiveinfo: receiveinfo
		}, function(result) {
			bas.wechatPay({
				userid: userid,
				orderid: result.data.orderid,
				bustype: 2,
				type: 2
			}, function(result) {
				//alert(JSON.stringify(result));
				if(result.successed) {
					jsApiCall = function jsApiCall() {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest',
								result.result, //josn串
								function(res) {
									WeixinJSBridge.log(res.err_msg);
									if(res.err_msg == "get_brand_wcpay_request:ok") {
										alert("购买成功！");
										cache.delCart()
										window.location.href = "../my/orders.html";
									} else {
										message.toast('支付失败，请重试!', messageType.warning);
									}
								}
							);
						}
						(function callpay() {
							if(typeof WeixinJSBridge == "undefined") {
								if(document.addEventListener) {
									document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
								} else if(document.attachEvent) {
									document.attachEvent('WeixinJSBridgeReady', jsApiCall);
									document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
								}
							} else {
								jsApiCall();
							}
						})();
				} else {
					message.toast('支付失败，请重试!', messageType.warning);
				}
			}, function(err) {
				message.toast('支付失败，请重试!', 'error');
			});
		}, function(err) {
			message.toast(err.message, 'error');
		})
	});
});

// 删除地址
function delAddress(addrid) {
	if(confirm("确认删除该地址信息？")) {
		var userid = cache.getUserId();
		if(!userid) return alert("用户未登录！");
		user.delAddress(userid, addrid, function(result) {
			alert("删除成功！");
			$("#a_" + addrid).remove();
		}, function(err) {
			alert("删除失败！");
		});
	}
};