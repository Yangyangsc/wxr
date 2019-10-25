var user = {
	/**
	 * 获取用户信息
	 * @param {Object} userid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getInfo: function(userid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.user.userInfo + "/" + userid, {
			type: 'get',
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取用户的地址
	 * @param {Object} userid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getAddressList: function(userid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.user.address.replace(":id", userid), {
			type: 'get',
			data: {
				userid: userid
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取用户的地址
	 * @param {Object} options
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	editAddress: function(options, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.user.address.replace(":id", options.userid), {
			type: 'post',
			data: options,
			success: onSuccess,
			fail: onFailed
		});
	},

	getAddrDetail: function(userid, addrid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.user.addressDetail.replace(":id", userid).replace(":addrid", addrid), {
			type: 'get',
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 删除地址
	 * @param {Object} userid
	 * @param {Object} addrid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	delAddress: function(userid, addrid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.user.addressDetail.replace(":id", userid).replace(":addrid", addrid), {
			type: 'delete',
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 编辑用户资料
	 * @param {Object} postDdata
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	editUserInfo: function(postDdata, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.user.userInfo, {
			type: 'put',
			data: postDdata,
			success: onSuccess,
			fail: onFailed
		});
	}
}