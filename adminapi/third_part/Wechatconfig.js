exports = module.exports={  
        appID: "wx671ba5ffd8a5027a",  
        appSecret: "fb1eadc33245751a81c27700f59688f6",  
        token: "i_love_jessica_forever",  
        prefix: "https://api.weixin.qq.com/cgi-bin/",  
        mpPrefix: "https://mp.weixin.qq.com/cgi-bin/",

        // 获取微信基础access-token的url
        accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
        // 获取微信网页授权所需的jsapi-ticket的url
        ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=',
        
        mch_id: "",  ////微信商户号，微信支付要用到的
        api_key: "", ////微信支付的api-key
        // 微信支付是否支持信用卡支付
        limit_pay: 'no_credit',
        // 微信支付回调通知支付结果
        notify_url: 'http://www.jmkbio.com/wechat/wxpay-cb',   
        //微信支付统一下单的prepay_id的url
        prepay_id_url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        //正式环境的微信端auth2.0网页授权回调URL
        webAuthServerUrl: 'http://www.******.com/wechat/authtoken', 
        //微信网页授权第一步所要请求获得code的URL
        webAuthCodeUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
        //微信网页授权所需的access_token，用于获取到用户的openid等信息
        webAuthTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token?'
}