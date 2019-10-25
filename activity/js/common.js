Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
var isSupportLocalStorage = function() {
	if(window.localStorage) {
		return true
	} else {
		return false
	}
}

var common = {
	endsWith: function(str, suffix) {
		return(str.substr(str.length - suffix.length) === suffix);
	},
	startWith: function(str, prefix) {
		return(str.substr(0, prefix.length) === prefix);
	},
	format: function(date, returnWhat) {
		//2017-05-10T16:00:00.000Z
		if(returnWhat == null) return date.substr(0, 10) + ' ' + date.substr(11, 5);
		if(returnWhat == 'date') return date.substr(0, 10);
		if(returnWhat == 'time') return date.substr(11, 5);
	},
	replace: function(strObject, findWhat, replaceTo, ingoreCase) {
		if(!strObject) return null;
		if(!RegExp.prototype.isPrototypeOf(findWhat)) {
			return strObject.replace(new RegExp(findWhat, (ingoreCase ? "gi" : "g")), replaceTo);
		}
		return strObject.replace(findWhat, replaceTo);
	},
	///验证是否手机号码
	isMobileNo: function(mobile) {
		var pattern = /^1[345678]\d{9}$/;
		return pattern.test(mobile);
	},
	addCache: function(key, value, options) {
		var cacheValue = value;
		var opt = $.extend(true, {
			expires: 7,
			path: '/'
		}, options)
		if(isSupportLocalStorage()) {
			window.localStorage[key] = cacheValue
		} else {
			cookie.save(key, cacheValue, opt)
		}
	},
	getCache: function(key) {
		var cacheValue;
		if(isSupportLocalStorage()) {
			cacheValue = localStorage[key]
		} else {
			cacheValue = cookie.load(key)
		}
		return cacheValue
	},
	clearCache: function(key) {
		if(isSupportLocalStorage()) {
			localStorage.removeItem(key)
		} else {
			cookie.save(key, null, {
				path: '/'
			})
		}
	},
	query: function() {
		var args = {}
		var query = typeof window == 'undefined' ? '' : location.search.substring(1); // 获取查询串  
		var pairs = query.split('&'); // 在逗号处断开  
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('='); // 查找name=value  
			if(pos == -1) { // 如果没有找到就跳过  
				continue
			}
			var argname = pairs[i].substring(0, pos); // 提取name  
			var value = pairs[i].substring(pos + 1); // 提取value  
			args[argname.toLocaleLowerCase()] = decodeURIComponent(value); // 存为属性  
			args[argname.toUpperCase()] = decodeURIComponent(value); // 存为属性  
			args[argname] = decodeURIComponent(value); // 存为属性  
		}
		return args; // 返回对象  
	},
	parseDate: function(strDate) {
		if(common.isEmpty(strDate))
			return ''
		var dateStr = strDate.replace(/-/g, '/').replace('/./g', '/')
		var dateValue = new Date()
		try {
			dateValue = new Date(dateStr)
		} catch(e) {
			dateStr = dateStr + ' 00:00:00'
			dateValue = new Date(dateStr)
		}
		return dateValue
	},
	isEmpty: function(obj) {
		if(typeof obj == 'object') {
			var name
			for(name in obj)
				return false
			return true
		} else if(obj === null || obj === undefined || obj === 'null' || obj === 'undefined' || obj === '')
			return true

		return false
	},
	combine2DateString: function(date1, date2) {
		///如果活动是一天，则只需要显示一个日期 + 两个时间，否则都显示
		var isSameDay = common.format(date1, 'date') == common.format(date2, 'date');
		var dateTimeString = isSameDay ?
			(common.format(date1, 'date') + ' ' + common.format(date1, 'time') + ' ~ ' + common.format(date2, 'time')) :
			(common.format(date1) + ' ~ ' + common.format(date2));
		return dateTimeString;
	},
	getActivityShareUrl: function(activityid, channelid, giftid) {
		var baseUrl = 'http://activity.huanxinkeji.cn/?';
		baseUrl = baseUrl + (activityid ? ('activityid=' + activityid) : '') +
			(channelid ? ('&channelid=' + channelid) : '') +
			(giftid ? ('&giftid=' + giftid) : '')
		return baseUrl;
	},
	cacheShareOption: function(option) {
		var shareOption = {
			title: '', // 分享标题
			desc: '', // 分享描述
			link: '', // 分享链接
			imgUrl: '', // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		}
		var opt = $.extend(true, shareOption, option)
		common.addCache('shareOption', JSON.stringify(opt));
	},
	///初始化微信分享
	createWXShareInit: function(shareOption, callback) {
		if(shareOption == null) {
			shareOption = JSON.parse(common.getCache('shareOption'));
		}
		wechatHelper.init(function() {
			shareOption.title = shareOption.title || '星活动';
			shareOption.desc = shareOption.desc || '星活动';
			wechatHelper.share(shareOption);
			if(callback && typeof callback == 'function')
				callback();
		});
	},
	/**
	 * 移除url中制定的参数
	 * @param {Object} str
	 * @param {Object} param
	 */
	removeUrlParams: function(url, param) {
		var reg = new RegExp("(\\?|&)" + param + "=[^&]*(&)?", "ig");
		return url.replace(reg, function(p0, p1, p2) {
			return p1 === '?' || p2 ? p1 : '';
		});
	}
}