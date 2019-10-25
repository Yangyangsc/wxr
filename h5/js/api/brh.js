var services = {
	qiyezixun: 'f14a7d3a-99ca-11e7-829f-3752f8e48c13',
	youxuanmeiti: 'ce97fccc-99ca-11e7-829f-3752f8e48c13',
	yanxuanmeiti: 'dd62b2a6-99ca-11e7-829f-3752f8e48c13',
	peixun: '156d6501-bc81-11e7-b6f9-54e1ad416bf3'
};
//1:媒体广告投放 2：智库咨询 3: 培训预约
var appType = {
	guanggao: 1,
	zhiku: 2,
	peixun: 3
}

var brh = {
	/**
	 * 获取智库信息
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getKols: function(onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.kollist, {
			type: 'get',
			success: onSuccess,
			fail: onFailed
		});
	},
	/**
	 * 登录
	 * @param {Object} account
	 * @param {Object} password
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	login: function(account, password, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.login, {
			type: 'post',
			data: {
				account: account,
				password: password
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 服务申请
	 * @param {Object} serviceId
	 * @param {Object} apptype
	 * @param {Object} appdataid
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	applyService: function(serviceId, apptype, appdataid, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.serviceApply, {
			type: 'post',
			data: {
				serviceid: serviceId,
				apptype: apptype,
				appdataid: appdataid,
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取个人服务
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getMyServices: function(onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.myServices, {
			type: 'post',
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 更新密码
	 * @param {Object} password
	 * @param {Object} newpassword
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	updatePassword: function(password, newpassword, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.updatePassword, {
			type: 'post',
			data: {
				password: password,
				newpassword: newpassword
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取个人申请信息
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getApplys: function(onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.applys, {
			type: 'get',
			success: onSuccess,
			fail: onFailed
		});
	},

	/**
	 * 获取媒体列表
	 * @param {Object} level
	 * @param {Object} page
	 * @param {Object} rows
	 * @param {Object} onSuccess
	 * @param {Object} onFailed
	 */
	getMedias: function(level, page, rows, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.medias, {
			type: 'get',
			waitingMask: false,
			data: {
				level: level,
				page: page,
				rows: rows
			},
			success: onSuccess,
			fail: onFailed
		});
	},

	getMediaDetail: function(mediano, start, end, onSuccess, onFailed) {
		apiCaller.call(urlConfig.api.brh.media.replace(":mediano", mediano), {
			type: 'get',
			data: {
				mediano: mediano,
				start: start,
				end: end
			},
			success: onSuccess,
			fail: onFailed
		});
	},
}