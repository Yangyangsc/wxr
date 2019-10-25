var apiServer = 'http://192.168.1.138:3000';
//var apiServer = 'http://webapi.litecoder.com';
var imageServer = "http://image.litecoder.com/";
var wechatAuth = "http://webapi.litecoder.com/wechat/oauth";
var apiCaller = {
    call: function (url, options) {
       var _self = this;
       var loading =null; 
       if(options.waitingMask==null) options.waitingMask = true;
       if (options.waitingMessage==null)options.waitingMessage="数据加载中";
       if (options.waitingMask) loading=weui.loading(options.waitingMessage);
       if (!common.startWith(url,'http://') && !common.startWith(url,'https://')){
          url = apiServer+(common.startWith(url,'/')?'':'/')+url;
       }
       var apiToken = {};
        $.ajax({
            url:  url,
            data: options.data || {},
            timeout:options.timeout || 10000,    ////默认超时10秒
            crossDomain: true,
            dataType: 'json',
            type: options.type == 'get' ? 'get' : 'post',
            // .done(function(data){
            //         if(data.successed){
            //             if(options.success && typeof(options.success)==="function")
            //                 options.success(data);
            //         }
            //         else if(options.error && typeof(options.error)==="function"){
            //                 options.error(data);
            //         }
            //     })
            // .fail(function(error){
            //      if(options.error && typeof(options.error)==="function")
            //             options.error({successed:false,errormessage:error.message});
            // })
            // .always(function(data,textStatus,error){
            //     if (error) console.log(error);
            //     if (loading) loading.hide();
            //     // if (textStatus==='error')  _self.redirectToLogin(true);
            //     //if (options.waitingMask) formHelper.loadEnd(); 
            // })
            success: function (result) {
                if (loading) loading.hide();
                if (result.successed){
                    if (options.success && typeof options.success == 'function') 
                        options.success(result)
                }
                else if(options.error && typeof(options.error)==="function"){
                        options.error(result);
                }
                
            },
            error: function (error) {
                if (loading) loading.hide();
                if (options.error && typeof options.error == 'function') {
                    options.error(error)
                }
            },
            
            });
    }
} 