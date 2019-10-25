// id="div_go_home" 添加方法跳转主页


var isgift;
$(function () {
	var userid = cache.getUserId();
	if (!userid) userid = common.query().userid;
	///当前打开的活动id
	var activityid = common.query().activityid;
	///当前的渠道id
	var channelid = common.query().channelid;
	///当前的增票id;
	var giftid = common.query().giftid;
	var isend = false;
	var curticket, memberonly = false,
		isvip = false,
		isfree = false;

	if (common.isEmpty(userid) || common.isEmpty(activityid))
		return alert('页面缺失重要参数，非法加载!');
	activity.getActDetail({
		actid: activityid,
		cid: channelid,
		gid: giftid,
		userid: userid
	}, function (result) {
		if (result.rows && result.rows.length > 0) {
			var arrText = doT.template($("#act_tmpl").text());
			var data = result.rows[0];
			data.saletotal = 0;
			for (var i = 0; i < data.ticket.length; i++) {
				data.saletotal += data.ticket[i].ticket_sold;
			}
			///确定当前是购买渠道或销售渠道
			isgift = data.channel_gift;
			if (isgift == null || isgift != 1) isgift = 0;
			$("#by_content").html(arrText(data));

			memberonly = data.activity_member_only;
			isvip = data.vip_count > 0;
			isfree = data.activity_is_free;
			isend = data.activity_end == 1;
			if (isfree && !isend) $("#a_freebuy").show();

			if (data.ticket.length > 0) {
				curticket = data.ticket[0];
				changeTicket(curticket);
				$("#div_cover").removeClass("hide");
				$("#div_info").removeClass("hide");
				$("#div_guige").removeClass("hide");
				$("#div_jieshao").removeClass("hide");
				$("#div_foot").removeClass("hide");
			} else {
				$("#div_rtcontent").css("margin-top", "auto");
				$("#div_rcontent").css("padding", "inherit");
			}
			//		alert(JSON.stringify(result));
			//减少
			$("#i_reduce").click(function (e) {
				var numEle = this.nextSibling;
				if (numEle.value <= 1) return e.value = 1;
				numEle.value--;
			});

			//增加
			$("#i_increase").click(function (e) {
				var numEle = this.previousSibling;
				var max = numEle.getAttribute("max");
				if (max != 0 && Number(numEle.value) >= Number(max)) {
					message.toast("购买数量不能大于" + max, 'error');
					return numEle.value = max;
				}
				numEle.value++;
			});

			// 选择不同票
			$(".ticket-gg").click(function (e) {
				var self = $(this);
				var ticketData = self.attr("data-json");
				var siblings = self.siblings(".ticket-active");
				if (siblings.length == 0) return;
				siblings.addClass("ticket-disabled").removeClass("ticket-active");
				self.addClass("ticket-active").removeClass("ticket-disabled");
				// 切换票据
				curticket = JSON.parse(ticketData);
				changeTicket(curticket);
			});
			$("#a_buy").click(function (e) {
				document.location.href = './make-order.html?id=' + curticket.ticket_id + (channelid ? "&cid=" + channelid : "") + ((isgift == 1 && giftid) ? "&giftid=" + giftid : "");
			});
			$("#a_freebuy").click(function (e) {
				document.location.href = './make-order.html?id=' + curticket.ticket_id + (channelid ? "&cid=" + channelid : "") + ((isgift == 1 && giftid) ? "&giftid=" + giftid : "");
			});
			// 跳转到首页
			$("#div_go_home").click(function (e) {
				document.location.href = "/activity.html"
				console.log(document.location.href)
			})
			initShare(data);
		}
	},
		function (err) {
			message.toast("获取数据失败", 'error');
		});

	var priceText = doT.template($("#price_tmpl").text());

	function changeTicket(ticket) {
		ticket.orgprice = ticket.ticket_discount_price > 0 ? ticket.ticket_discount_price : ticket.ticket_price;
		ticket.price = (ticket.ticket_discount_price > 0 ? ticket.ticket_discount_price.toFixed(2) : ticket.ticket_price.toFixed(2)).split(".");
		if (!isend && (memberonly == 0 || isvip > 0) && !isfree) {
			//			$("#buy_count").attr("max", ticket.ticket_max - ticket.ticket_sold);
			if (ticket.gift_bought > 0) {
				$("#a_giftbuyed").show();
				$("#a_buy").hide();
				$("#a_not").hide();
			} else if (ticket.ticket_max - ticket.ticket_sold <= 0) {
				$("#a_not").show();
				$("#a_buy").hide();
			} else {
				$("#a_not").hide();
				$("#a_buy").show();
			}
		}
		$("#a_price").html(priceText(ticket));
	};

	function initShare(adata) {
		var shareTitle = adata.sharetitle;
		if (isgift == 1 && !common.isEmpty(adata.gifttitle)) {
			shareTitle = adata.gifttitle;
		}
		var shareOption = {
			title: common.isEmpty(shareTitle) ? adata.activity_topic : shareTitle,
			desc: adata.activity_desc,
			imgUrl: adata.avtivity_share_image ? imageServer + common.replace(adata.avtivity_share_image, '\\\\', '\/') : defaultShareImg,
			link: "http://activity.huanxinkeji.cn/activity/activity-details.html?" + (activityid ? ('activityid=' + activityid) : '') + (channelid ? ('&channelid=' + channelid) : '') + (giftid ? ('&giftid=' + giftid) : '')+(userid?('&shareid='+userid ):'')
		};

		console.log(shareOption)
		wechatHelper.initToShare(shareOption, "actDetail");
	};
});