var bas = {
	/**
	 * 通过父id获取地区
	 * @param {Object} parentid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getDistricts: function(parentid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.bas.districts, {
			type: 'get',
			data: {
				parentid: parentid || ""
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	wechatPay: function(options, onSuccess, onFailed) {
		var postData = $.extend(true, {
			userid: "",
			orderid: "",
			bustype: 0,
			type: 0
		}, options);
		apiCaller.call(urlConfig.api.bas.wechatPay, {
			type: 'post',
			data: postData,
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取广告位信息
	 * @param {Object} sliderkey
	 * @param {Object} platform
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getSliders: function(sliderkey, platform, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.bas.sliders, {
			type: 'get',
			data: {
				key: sliderkey,
				platform: platform
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	uploadFile: function(fileType, file, onSuccess, onFailed) {
		upload.html5Upload(urlConfig.api.bas.upload.replace(":filetype", fileType), file, {
			onLoad: onSuccess,
			onError: onFailed
		});
	}
}