var adminServer = "http://api.huanxinkeji.cn/";
var apiServer = "http://webapi.huanxinkeji.cn/";
var imageServer = "http://image.huanxinkeji.cn/";
var scanRoot = "http://scan.huanxinkeji.cn";
var apiCaller = {
    authCall: function (url, options) {
        var tokenStr = common.getCache('token');
        var tokenCache = tokenStr ? JSON.parse(tokenStr) : {};
        var opt = $.extend(true, options, {
            headers: {
                authorization: tokenCache.token ? tokenCache.token : ''
            }
        })
        apiCaller.ajax(adminServer + url, opt);
    },
    call: function (url, options) {
        apiCaller.ajax(apiServer + url, options);
    },
    ajax: function (url, options) {
        options.loadding = options.loadding == false ? false : true;
        var loading = null
        if (options.loadding)
            loading = weui.loading('正在加载...');
        $.ajax({
            url: url,
            data: options.data || {},
            type: options.type == 'get' ? 'get' : 'post',
            headers: options.headers || {},
            success: function (result) {
                if (!result.successed && result.errorcode == 10000) {
                    window.location.href =scanRoot+'/login.html';
                    return;
                }
                loading.hide();
                if (typeof options.success == 'function') {
                    options.success(result)
                }
            },
            error: function (error) {
                loading.hide();
                if (typeof options.error == 'function') {
                    options.error(error)
                }
            },
            dataType: 'json'
        });
    }
} 