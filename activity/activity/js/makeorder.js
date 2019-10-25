// 添加优惠券  yhq
// 进行优惠券加减法 若优惠券大于或等于支付金额，另外方法跳转出票


var activity_price, channeldiscount, member_price = 0, ismember, memberbought, yhq;

$(function () {
	///从上一个页面过来的用户选择的票类型id(ticketid)
	///从渠道引流过来的渠道信息id(channelid)
	var ticketid, channelid, isgift, giftid, userid;
	userid = cache.getUserId();
	///从上一个页面过来的用户选择的票类型id
	ticketid = common.query().id;
	///从URL中获取到渠道id
	channelid = common.query().cid;
	///该票是否是赠票
	//isgift = common.query().isgift;
	///赠票的id
	giftid = common.query().giftid;
	//if (isgift!="1") isgift=0;

	if (common.isEmpty(userid) || common.isEmpty(ticketid))
		alert('页面缺失重要参数，非法加载!');
	else {
		initLoad();
		bindhandle();
		wechatHelper.initToShare(null, "actDetail");
	}

	function bindhandle() {
		$("#btnPay").on('click', function () {
			validForm();
		})
		$("#number").on("change", function (e) {
			var count = $(this).val() || 1;
			if (isNaN(count))
				$(this).val(1);
			reloadPrice($(this).val());
		})
		if (isgift != 1) {
			$("#remove-btn").on('click', function () {
				var count = $("#number").val() || 1;
				var newCount = parseInt(count) <= 1 ? parseInt(count) : parseInt(count) - 1;
				$("#number").val(newCount);
				reloadPrice(newCount);
			});
			$("#add-btn").on('click', function () {
				var count = $("#number").val() || 1;
				var newCount = parseInt(count) + 1;
				$("#number").val(newCount);
				reloadPrice(newCount);
			});
		}
	}

	function validForm() {
		weui.form.validate('#orderForm', function (error) {
			if (!error) {
				if (common.isMobileNo($("#tel").val()) == false) {
					message.toast('请输入正确的手机号码', messageType.warning);
					return;
				}
				submit()
			}
		});
	}

	function submit() {
		
		activity.makeOrder({
			userid: userid,
			mobile: $("#tel").val(),
			ticketid: ticketid,
			username: $("#username").val(),
			company: $("#company").val(),
			position: $("#position").val(),
			total: $("#number").val(),
			giftid: giftid, ////赠票传送过去
			tickettype: '',
			channelid: channelid,
			yhq: yhq
		}, function (result) {
			if (result.rows && result.rows.length > 0) {
				var orderData = result.rows[0];
				if (orderData.finish == 0) { ////如果非赠票，开启微信支付
					openWechatPay(orderData.orderid)
				} else { ////否则直接跳转到成功
					document.location.href = 'activity-ticket.html?orderid=' + orderData.orderid;
				}
			} else {
				message.toast(result.message, messageType.warning);
			}
		}, function (err) {
			console.log(err)
			message.toast(err.message, messageType.warning);
		});
	};

	function openWechatPay(orderid) {
		var jsApiCall = null;
		bas.wechatPay({
			userid: userid,
			orderid: orderid,
			bustype: 0,
			type: 0
		}, function (result) {
			if (result.successed) {
				if (result.amount == 0) {
					window.location.href = "activity-ticket.html?orderid=" + orderid;
				}
				jsApiCall = function jsApiCall() {
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest',
						result.result, //josn串
						function (res) {
							console.log(1111111111)
							console.log(res)
							WeixinJSBridge.log(res.err_msg);
							if (res.err_msg == "get_brand_wcpay_request:ok") {
								window.location.href = "activity-ticket.html?orderid=" + orderid;
							} else {
								message.toast('支付失败，请重试!', messageType.warning);
							}
						}
					);
				}
					(function callpay() {
						if (typeof WeixinJSBridge == "undefined") {
							if (document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
							} else if (document.attachEvent) {
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
		}, function (err) {
			var totalprice = $("#totalPrice").text()
			var temp = totalprice.split("￥")
			if (temp[1] == 0) {
				window.location.href = "activity-ticket.html?orderid=" + orderid;
			} else {
				message.toast('支付失败，请重试!', 'error');
			}
		});
	};

	function reloadPrice(count) {
		if (ismember && memberbought <= 0 && member_price != activity_price) {
			var coupon = yhq ? parseFloat(yhq) : 0
			// 优惠卷
			$("#coupon").text("￥" + coupon.toFixed(2))
			$("#ticketPrice").text("￥" + (member_price * count).toFixed(2));
			var totalprice = ((member_price * count) - coupon).toFixed(2)
			$("#totalPrice").text("￥" + (totalprice <= 0 ? 0 : totalprice));
			return;
		}

		activity_price = activity_price ? parseFloat(activity_price) : 0;
		channeldiscount = channeldiscount ? parseFloat(channeldiscount) : 0;
		var coupon = yhq ? parseFloat(yhq) : 0

		var totalPrice = ((parseFloat(channeldiscount) * count * activity_price / 100.0) - coupon).toFixed(2)
		var discount = (activity_price * count) - totalPrice;



		// 订单金额
		$("#ticketPrice").text("￥" + (activity_price * count).toFixed(2));
		// 优惠金额
		$("#discount").text("－￥" + discount.toFixed(2));
		// 优惠卷
		$("#coupon").text("￥" + coupon.toFixed(2))
		// 支付金额
		$("#totalPrice").text("￥" + (totalPrice <= 0 ? 0 : totalPrice))
	};

	var activityCover;

	function initLoad() {
		activity.getTicketForOrder({
			id: ticketid,
			cid: channelid,
			gid: giftid,
			userid: userid
		}, function (result) {
			if (result.rows.length > 0) {
				var rowData = result.rows[0];
				isgift = rowData.channel_gift;
				if (isgift != 1) {
					giftid = '';
					isgift = 0;
				};
				var count = $("#number").val() || 1;
				$("#imgBanner").attr('src', imageServer + rowData.activity_cover);
				activityCover = rowData.activity_cover;
				///没有从渠道这边过来的,则隐藏渠道的相关栏位显示
				if (!common.isEmpty(rowData.channelname)) $(".fromchannel").show();
				var totalPrice;
				ismember = rowData.ismember;
				memberbought = rowData.member_bought;
				if (rowData.ismember && rowData.member_bought <= 0 && rowData.ticket_member_price != rowData.activity_price) {
					//member_price = rowData.ticket_member_price;
					totalPrice = count * rowData.ticket_member_price;
					$("#price").text("￥" + rowData.ticket_member_price.toFixed(2));
				} else {
					$("#price").text("￥" + rowData.activity_price.toFixed(2));
					totalPrice = (rowData.channeldiscount / 100) * count * rowData.activity_price;
				}
				var discount = (rowData.activity_price * count) - totalPrice;
				///如果活动是一天，则只需要显示一个日期 + 两个时间，否则都显示
				var dateTimeString = common.combine2DateString(rowData.activity_date_start, rowData.activity_date_end);

				var desc = dateTimeString + ' </br>' + rowData.activity_city_name + ' -' + rowData.activity_location;

				member_price = rowData.ticket_member_price;
				activity_price = rowData.activity_price;
				channeldiscount = rowData.channeldiscount;
				yhq = rowData.yhq
				///如果界面是赠票，隐藏相关的一些信息，调整一些相关文字
				if (isgift == 1) {
					$("#add-btn,#remove-btn").hide();
					if (rowData.had_ticket == 0) {
						$('#btnPayButton').text("领取赠票");
						$('#btnPay,#btnPayButton').css('backgroundColor', '#ae00c3');
					} else {
						$('#btnPayButton').text("您已经领取");
						$('#btnPay,#btnPayButton').css('backgroundColor', 'gray');
						$("#btnPay").unbind('click');
					}

					$('#channelContainer>p').text("赠票渠道");
					$('#ticketTypeFront').text('赠票类型');
					$('#priceFront').text('赠票价值');
					$('#orderTotalContainer').hide();
					$('#paymentDisplay').hide();
					///赠送模式下渠道折扣不再显示
					rowData.channeldiscount = 100;
				}
				reloadPrice(count);

				$(".weui-media-box__title").text(rowData.activity_topic);
				$(".weui-media-box__desc").html(desc);
				$("#ticketType").text(rowData.ticket_title);
				$("#username").val(rowData.username);
				$("#tel").val(rowData.mobile);
				$("#company").val(rowData.company);
				$("#position").val(rowData.position);

				$("#code").text(rowData.channelname + (rowData.channeldiscount < 100 ? ('（' + (rowData.channeldiscount / 10.0) + '折）') : ''));
				if (rowData.channeldiscount >= 100 || isgift == 1) {
					$("#channelDiscount").hide();
				}

			}
		}, function (err) {
			message.toast("服务器繁忙，请稍后重试", 'error');
		});
	}

});