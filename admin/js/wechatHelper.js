var manualShare = false;
var userid = cache.getUserId();

var wechatHelper = {
	init: function (callback, options) {
		var wxConfig = {
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			// appId: 'wx2168e72523959a1d', // 必填，公众号的唯一标识
			appId: 'wx3d5296018f11f9a7', // 必填，公众号的唯一标识
			jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode', 'openLocation', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		}
		var shareUrl = window.location.href.split('#')[0];
		var timestamp = (new Date()).valueOf()
		$.ajax({
			url: 'http://webapi.huanxinkeji.cn/wechat/jsconfig',
			data: {
				url: shareUrl
			},
			success: function (result) {
				var data = {}
				if (typeof result === "string")
					data = JSON.parse(result);
				else
					data = result
				var cfg = $.extend(true, {}, wxConfig, {
					appId: data.appId,
					nonceStr: data.nonceStr,
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					signature: data.signature, // 必填，签名，见附录1
				})

				wx.config(cfg)
				wx.ready(function () {
					callback(options);
				})
				wx.checkJsApi({
					jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
					success: function (res) {
						// 以键值对的形式返回，可用的api值true，不可用为false
						// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
						console.log(res)
					}
				});
				wx.error(function (res) {
					console.log(res.errMsg);
				});

			},
			error: function (err) {
				console.log(err)
			}
		});
		manualShare = true;
	},
	scan: function (options) {
		options.success = options.success || function () { };
		options.cancel = options.cancel || function () { };
		options.fail = options.fail || function () { };
		options.complete = options.complete || function () { };

		wx.scanQRCode({
			needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			success: function (res) {
				var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				options.success(result)
			},
			fail: function (res) {
				// 接口调用失败时执行的回调函数。
				var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				options.success(result)
			},
			complete: function (res) {
				// 接口调用完成时执行的回调函数，无论成功或失败都会执行。
				options.complete(res)
			},
			cancel: function (res) {
				// 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
				options.cancel(res)
			},
		});
	},
	share: function (options) {
		let that = this
		wx.onMenuShareTimeline({
			title: options.title,
			link: options.link,
			imgUrl: options.imgUrl,
			desc: options.desc,
			success: function (res) {
				that.setShare(options.link)
				console.log('onMenuShareTimeline ok');
				if (options.success && typeof options.success == 'function')
					options.success();
			},
			fail: function (err) {
				console.log('onMenuShareTimeline fail');
				if (options.fail && typeof options.fail == 'function')
					options.fail();
			}
		})
		wx.onMenuShareAppMessage({
			title: options.title,
			link: options.link,
			imgUrl: options.imgUrl,
			desc: options.desc,
			success: function (res) {
				that.setShare(options.link)
				console.log('onMenuShareAppMessage ok');
				if (options.success && typeof options.success == 'function')
					options.success();
			},
			cancel: function (err) {
				console.log('onMenuShareAppMessage cancel');
				if (options.fail && typeof options.fail == 'function')
					options.fail();
			}
		})
	},
	setShare: function (link) {
		$.ajax({
			url: apiBase +'/toshare',
			data: {
				uid: userid,
				link: link
			},
			success: function (result) {
        console.log(result)
        if(result.message == '达到了分享上限') { 
             Prompt('.Prompt',result.message)
        }
			}
		})
	},
	openLocation: function (localOption) {
		wx.openLocation({
			latitude: localOption.latitude, // 纬度，浮点数，范围为90 ~ -90
			longitude: localOption.longitude, // 经度，浮点数，范围为180 ~ -180。
			name: localOption.name, // 位置名
			address: localOption.address, // 地址详情说明
			scale: localOption.scale ? localOption.scale : 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
			infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
		});
	},
	hideCopyLink: function () {
		// 批量隐藏功能按钮接口
		wx.hideMenuItems({
			menuList: ['menuItem:copyUrl', 'menuItem:openWithSafari', 'menuItem:share:email', 'menuItem:openWithQQBrowser'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
		});
	},
	hideQQLink: function () {
		// 批量隐藏功能按钮接口
		wx.hideMenuItems({
			menuList: ['menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
		});
	},

	/**
	 * jssdk分享初始化
	 * @param {Object} shareOption
	 * @param {Object} cacheKey
	 * @param {Object} callback
	 */
	initToShare: function (shareOption, cacheKey, callback) {
		cacheKey = cacheKey || "shareOption";
		if (shareOption == null) {
			shareOption = cache.getValueByKey(cacheKey);
			if (shareOption == null) { // 如果分享参数不存在复制默认值
				shareOption = {
					title: "新媒体最强大脑争霸赛",
					desc: "送你免费会见新媒体大佬，赢得与秦朔午餐机会",
					imgUrl: location.protocol + "//" + location.host + "/images/share_default.jpg",
					link: location.href
				};
			}
		} else {
			var option = {
				title: '', // 分享标题
				desc: '', // 分享描述
				link: '', // 分享链接
				imgUrl: '', // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			}
			shareOption = $.extend(true, option, shareOption);
			cache.setKeyValue(cacheKey, JSON.stringify(shareOption));
		}
		this.init(function (options) {
			this.share(options);
			if (callback && typeof callback == 'function')
				callback();
		}.bind(this), shareOption);
	}
};

// 如果页面未曾手动调用分享，在页面加载完毕自动加上分享
// window.onload = function () {
	// setTimeout(function () {
if (!manualShare) {
  wechatHelper.initToShare();
}
	// }, 700);
// }

