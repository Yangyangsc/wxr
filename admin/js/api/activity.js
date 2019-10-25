var activity = {
	/**
	 * 获取活动列表
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getActList: function(catelogid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.activity.actList, {
			type: 'get',
			data: {
				cateid: catelogid
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取活动详情
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getActDetail: function(options, onSuccess, onFailed) {
		var reqData = $.extend(true, {
			cid: "",
			gid: "",
			userid: ""
		}, options)
		apiCaller.call(urlConfig.api.activity.actDetail.replace(":id", reqData.actid), {
			type: 'get',
			data: reqData,
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取活动订单列表
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getActOrders: function(options, onSuccess, onFailed) {
		var reqData = $.extend(true, {
			uid: "",
			page: 1,
			rows: 20
		}, options);
		apiCaller.call(urlConfig.api.activity.actOrders, {
			type: 'get',
			data: reqData,
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取优惠券
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getYhq: function(options, onSuccess, onFailed) {
		var reqData = $.extend(true, {
			uid: "",
			page: 1,
			rows: 20
		}, options);
		apiCaller.call(urlConfig.api.activity.actOrders_yhq, {
			type: 'get',
			data: reqData,
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 修改优惠券
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	edityhq: function(options, onSuccess, onFailed) {
		var reqData = $.extend(true, {
			uid: "",
			page: 1,
			rows: 20
		}, options);
		apiCaller.call(urlConfig.api.activity.actOrders_edityhq, {
			type: 'post',
			data: reqData,
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取活动的票据
	 * @param {Object} orderid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getOrderTicket: function(dict, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.activity.actTicket.replace(":id", dict.orderid), {
			type: 'get',
			success: onSuccess,
			fail: onFailed,
			data:dict.useid
		});
	},

	/**
	 * 提交订单
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	makeOrder: function(options, onSuccess, onFailed) {
		var postData = $.extend(true, {}, options);
		apiCaller.call(urlConfig.api.activity.actOrders, {
			type: 'post',
			data: postData,
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取票据和活动相关信息
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getTicketForOrder: function(options, onSuccess, onFailed) {
		var getData = $.extend(true, {}, options);
		apiCaller.call(urlConfig.api.activity.ticketForOrder.replace(":id", options.id), {
			type: 'get',
			data: getData,
			success: onSuccess,
			fail: onFailed
		});
	},
}