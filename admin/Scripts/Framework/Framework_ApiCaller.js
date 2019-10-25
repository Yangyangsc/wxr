var CACHE_USER_KEY = "user-storage";
var ApiCaller = {
    ///用LocalStorage保存
    cacheItem:function(key,value) {
        var storage=window.localStorage;
        if (typeof(value)!="string") value = JSON.stringify(value);
        storage.setItem(key,value);
    },
    ///获取LocalStorage的东西
    getItem:function(key,jsonFormat){
        if (jsonFormat==null) jsonFormat= true;
        var storage=window.localStorage;
        var stringValue=storage.getItem(key);
        if (jsonFormat){
            if (!$.isNullOrEmpty(stringValue)) return JSON.parse(stringValue); 
            return null;
        } 
        return stringValue;
    },
    ///清楚用户本地信息
    clearUser:function(){
        var storage=window.localStorage;
        storage.removeItem(CACHE_USER_KEY); 
    },
    ////获取当前的token
    getUser:function() {
        var storage=window.localStorage;
        var userString=storage.getItem(CACHE_USER_KEY); 
        if ($.isNullOrEmpty(userString)){
           this.redirectToLogin(true);
        } 
        return JSON.parse(userString); 
    },
    ///保存调用的Token
    setUser:function(value){
        this.cacheItem(CACHE_USER_KEY,value);
    },
    redirectToLogin:function(withReturnUrl){
        var retUrl = '';
        if (withReturnUrl) retUrl ='?returnUrl='+encodeURIComponent(window.location.href)
        window.location.href=urlConfig.base.Root+'/login.html'+retUrl;
    },
    ///调用api
    callApi:function(callOpt){
        var _self = this;
       if(callOpt.waitingMask==null) callOpt.waitingMask = true;

       if (callOpt.waitingMask) formHelper.loadingWait(callOpt.waitingMessage || "数据处理中...");
       if (callOpt.withToken==null) callOpt.withToken = true;
       if (!$.startWith(callOpt.url,'http://') && !$.startWith(callOpt.url,'https://'))
       {
           callOpt.url = urlConfig.base.ApiRoot+($.startWith(callOpt.url,'/')?'':'/')+callOpt.url;
       }
       var apiToken = {};
       if (callOpt.withToken) apiToken.authorization =_self.getUser().token;
       $.ajax({
                type:callOpt.type,
                url: callOpt.url,
                timeout:callOpt.timeout || 10000,    ////默认超时10秒
                headers : apiToken,                  ////调用时带上认证的Token
                data:callOpt.data,                   ////
                json:callOpt.json || true,
                crossDomain: true,
            })
            .done(function(data){
                    if(data.successed)
                    {
                        if(callOpt.successFunc && typeof(callOpt.successFunc)==="function")
                            callOpt.successFunc(data);
                    }
                    else
                    {
                        if (data.errorcode==10000 || ////未认证
                            data.errorcode==9999 ||  ///Token 无效
                            data.errorcode==9998 ||  ///Token过期
                            data.errorcode==9100)   ///没有权限
                            _self.redirectToLogin(true);
                        else if(callOpt.failFunc && typeof(callOpt.failFunc)==="function")
                            callOpt.failFunc(data);
                    }
                })
            .fail(function(error){
                 if(callOpt.failFunc && typeof(callOpt.failFunc)==="function")
                        callOpt.failFunc({successed:false,errormessage:error.message});
            })
            .always(function(data,textStatus,error){
                if (error) console.log(error);
                // if (textStatus==='error')  _self.redirectToLogin(true);
                if (callOpt.waitingMask) formHelper.loadEnd(); 
            })
    },
    /*
    调用GET API
    */
    Get:function(option){
        console.log(option)
        option.type="GET";
        ApiCaller.callApi(option);
    },
    /*
    调用GET API
    */
    Delete:function(option){
        option.type="DELETE";
        ApiCaller.callApi(option);
    },
    /*
    调用Post方式的API
    */
    Post:function(option){
        option.type="POST";
        ApiCaller.callApi(option);
    },
    /*
    调用Post方式的API
    */
    Put:function(option){
        option.type="PUT";
        ApiCaller.callApi(option);
    }

}