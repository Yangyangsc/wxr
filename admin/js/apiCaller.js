
var apiServer = 'http://webapi.huanxinkeji.cn';

var _loading = null;
var apiCaller = {

	call: function(url, options) {
		var _self = this;
		if(options.waitingMask == null) options.waitingMask = true;
		if(options.waitingMessage == null) options.waitingMessage = "数据加载中";
		if(options.waitingMask && _loading == null) _loading = weui.loading(options.waitingMessage);
		if(!common.startWith(url, 'http://') && !common.startWith(url, 'https://')) {
			url = apiServer + (common.startWith(url, '/') ? '' : '/') + url;
		}
		var apiToken = {};
		if(typeof cache!="undefined" && cache.getBrhUser()) apiToken.authorization = cache.getBrhUser().token;
		$.ajax({
			url: url,
			data: options.data || {},
			timeout: options.timeout || 10000, ////默认超时10秒
			headers: apiToken,
			crossDomain: true,
			dataType: 'json',
			type: options.type ? options.type : 'get',
			success: function(result) {
				if(_loading != null) {
					_loading.hide();
					_loading = null;
				}
				if([9997, 9998, 9999, 10000].indexOf(result.errorcode) >= 0 && window.location.href.toLowerCase().indexOf("login.html") == -1) {
					cache.clearBrhUser();
					window.location.href = '/brh/login.html' + '?returnUrl=' + encodeURIComponent(window.location.href);
					return;
				}
				if(result.successed) {
					if(options.success && typeof options.success == 'function')
						options.success(result);
				} else if(options.fail && typeof(options.fail) === "function") {
					options.fail(result);
				} else if(options.error && typeof options.error == 'function') {
					options.error(result);
				}
			},
			error: function(error) {
				if(_loading != null) {
					_loading.hide();
					_loading = null;
				}
				if(options.error && typeof options.error == 'function') {
					options.error(error)
				}
			},
		});
	},
}