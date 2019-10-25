var wechatHelper = {
    init: function (callback, options) {
        var wxConfig = {
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //appId: 'wx2168e72523959a1d', //(蓝莓会的AppId) 必填，公众号的唯一标识 
            appId: 'wx3d5296018f11f9a7', //(轻码服务号的AppId) 必填，公众号的唯一标识
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
        var shareUrl = window.location.href.split('#')[0];
        var timestamp = (new Date()).valueOf()
        $.ajax({
            url: 'http://webapi.huanxinkeji.cn/wechat/jsconfig',
            data: { url: shareUrl },
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
                    callback();
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
        })
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
                //alert(JSON.stringify(res));
                options.fail(result)
            },
            complete: function (res) {
                // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
                //weui.alert("complete:"+JSON.stringify(res));
                options.complete(res)
            },
            cancel: function (res) {
                // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
                // weui.alert('cancek');
                options.cancel(res)
            },
        });
    },
    share: function (shareTitle, shareDesc, shareLink, shareImage) {
        wx.onMenuShareTimeline({
            title: shareTitle,
            link: shareLink,
            imgUrl: shareImage,
            desc: shareDesc,
            success: function (res) {
                console.log('onMenuShareTimeline ok')
            },
            fail: function (res) {
                console.log('onMenuShareTimeline fail')
            }
        })
        wx.onMenuShareAppMessage({
            title: shareTitle,
            link: shareLink,
            imgUrl: shareImage,
            desc: shareDesc,
            success: function () {
                console.log('onMenuShareAppMessage ok')
            },
            cancel: function () {
                console.log('onMenuShareAppMessage cancel')
            }
        })
    }
}