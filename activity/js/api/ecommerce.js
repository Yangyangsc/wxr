var ecommerce = {
	/**
	 * 获取商品列表
	 * @param {Object} page
	 * @param {Object} rows
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getProducts: function(page, rows, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.ecommerce.productList, {
			type: 'get',
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取产品详情
	 * @param {Object} userid
	 * @param {Object} productid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getProductDetail: function(userid, productid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.ecommerce.productDetail + productid, {
			type: 'get',
			data: {
				pid: productid,
				uid: userid
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取商品心情
	 * @param {Object} userid
	 * @param {Object} productid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getProductForOrder: function(userid, productid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.ecommerce.productDetail + productid, {
			type: 'get',
			data: {
				pid: productid,
				uid: userid
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取用户订单
	 * @param {Object} useuserid
	 * @param {Object} onSuccess
	 * @param {Object} onFailedrid
	 */
	getOrderList: function(userid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.ecommerce.orderList, {
			type: 'get',
			data: {
				userid: userid
			},
			success: onSuccess,
			fail: onFailed
		});
	},
	makeOrder: function(options, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.ecommerce.makeOrder, {
			type: 'post',
			data: options,
			success: onSuccess,
			fail: onFailed
		});
	}
}