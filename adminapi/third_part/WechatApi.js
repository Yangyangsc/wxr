/*
    封装了微信调用的相关方法
*/
var qs = require('qs');
var crypto = require('crypto');
var xml2js = require('xml2js');
var event = require('events');
var rpc = require('../core/rpc/rpcUtility');
var wxConfig = require('./Wechatconfig');
var appID = wxConfig.appID;  
var appSecret = wxConfig.appSecret; 
var api = {
    accessToken : wxConfig.accessTokenUrl,//token?grant_type=client_credential,  
    upload : `${wxConfig.prefix}media/upload?`
} 
//2小时过期时间，60*60*2
var expireTime = 7200 -100;
class WechatApi extends event.EventEmitter
{
    
    constructor(req,res){
        super();
        this.config = wxConfig;
        //用于存储微信的基础access-token值，每天有请求限制次数
        this.gloAccessTokenData = {};
        //公众号微信端页面请求所需jsapi-ticket数据缓存，每天有请求限制，用于签名并返回给前端构造wx.config
        this.jsapiTicketData = {};
    }
    /*
    和微信验证握手
    */
    static validateSignature(req,res,next){
        if (req.method != 'GET') 
        {
            next();
            return;
        }
        // wechatConfig = wechatConfig || {};  
        var q = req.query;  
        var token = wxConfig.token;  
        var signature = q.signature; //微信加密签名  
        var nonce = q.nonce; //随机数  
        var timestamp = q.timestamp; //时间戳  
        var echostr = q.echostr; //随机字符串  
        /* 
            1）将token、timestamp、nonce三个参数进行字典序排序 
            2）将三个参数字符串拼接成一个字符串进行sha1加密 
            3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信 
        */  
        var str = [token, timestamp, nonce].sort().join('');  
        var sha1 = crypto.createHash('sha1');
        var sha = sha1.update(str).digest('hex');
        if (req.method == 'GET') {  
            if (sha == signature) {  
                res.send(echostr+'')  
            }else{  
                res.send('err');  
            }  
        }  
        else if(req.method == 'POST'){  
            if (sha != signature) {  
                return;  
            }  
            next();  
        }  
    } 
    //取得timestamp
    getTimeStamp() {  return parseInt(new Date().getTime() / 1000) + '';}
    /*
    获取微信调用的access_token
    */
    *updateAccessToken(){
        ///检查缓存中是否有AccessToken并且没过期
        if (this.gloAccessTokenData.token && gloAccessTokenData.timestamp) {
            var t = this.getTimeStamp() - this.gloAccessTokenData.timestamp;
            console.log('the gap of last time to get glo-access-token is : ', t);
            // 数据是否过期判断,如果没有过期，直接使用缓存中的Token
            ///否则重新获取Token
            if (t < expireTime) {
                console.log('get the cache access-token data!');
                return {access_token:this.gloAccessTokenData.token};
            }
        }
        var url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`;  
        //console.log(url);  
        var option = {url : url,json : true};  
        var tokenData = yield rpc.request(option);
        var _token = tokenData.access_token;
        // 将取得的access-token保存到内存
        this.gloAccessTokenData = {token: _token,timestamp:this.getTimeStamp()};
        return {access_token:this.gloAccessTokenData.token}; 
    }

    // 取得微信网页端所需的jsapi-ticket
    *getJSApiTicket() {
        this.jsapiTicketData = this.jsapiTicketData || {};
        // 先判断内存（缓存）中是否已有jsapi-ticket数据
        if (this.jsapiTicketData && this.jsapiTicketData.timestamp) {
            var t = this.getTimeStamp() - jsapiTicketData.timestamp;
            console.log('the gap of last time to get jsapi-ticket is : ', t);
            // 数据是否过期判断，如果没有过期直接返回
            if (t < expireTime) {
                console.log('get the cache access-token data!');
                return {ticket:jsapiTicketData.ticket};
            }
        }
        var tokenData = yield this.updateAccessToken();
        var url = wxConfig.tiketUrl+tokenData.access_token+'&type=jsapi';
        var option = {url : url,json : true};  
        var ticketData = yield rpc.request(option);
        var _ticket = JSON.parse(ticketData).ticket;
        // 将取得的ticket保存到内存
        this.jsapiTicketData = {token:tokenData.access_token, ticket:_ticket,timestamp:this.getTimeStamp()};
        return {ticket:jsapiTicketData.ticket};
    };

    
    /*
    根据公众号授权获取到code，通过code获取到认证的token
    */
    getAuthorizationToken(code) {
        let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
        let params = {
            appid: appID,
            secret: appSecret,
            code: code,
            grant_type:'authorization_code'
        };

        let options = {
            method: 'get',
            url: reqUrl+qs.stringify(params),
            json : true
        };
        console.log(options.url);
        return rpc.request(options);
        
    }
     /*
    根据Token 和 openid 获取用户的信息
    */
    getUserInfo (token, openid) {
        var reqUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?';
        //https://api.weixin.qq.com/sns/userinfo?';
        var params = {access_token: token,openid: openid,lang:'zh_CN'}
        var options = {
            method: 'get',
            url: reqUrl + qs.stringify(params)
        }
        console.log(options.url)
        return rpc.request(options);
    }
    /*
    接收到微信端发过来的任何消息，进行本地化预处理
    从而转化为不同类型的本地消息，给程序处理，件toJSON
    */
    handlerEvent(req,res) {
        var xml = '';
        req.setEncoding('utf8');
        req.on('data',  (chunk)=> xml += chunk);
        req.on('end', () => this.toJSON(this,xml));
        /**
         * clear all listening events to avoid repeat triggers
         */
        this.removeAllListeners('text');
        this.removeAllListeners('voice');
        this.removeAllListeners('event');
    }
    /*
    将微信发送的消息转为Json格式的对象
    */
    toJSON(instance,xml){
        var msg = {};
        xml2js.parseString(xml,(err, result)=> {
            var data = result.xml;
            msg.ToUserName = data.ToUserName[0];
            msg.FromUserName = data.FromUserName[0];
            msg.CreateTime = data.CreateTime[0];
            msg.MsgType = data.MsgType[0];
            switch(msg.MsgType) {
            case 'text' : 
                msg.Content = data.Content[0];
                msg.MsgId = data.MsgId[0];
                instance.emit("text", msg);
                break;
            case 'image' : 
                msg.PicUrl = data.PicUrl[0];
                msg.MsgId = data.MsgId[0];
                msg.MediaId = data.MediaId[0];
                instance.emit("image", msg);
                break;
            case 'voice' :
                msg.MediaId = data.MediaId[0];
                msg.Format = data.Format[0];
                msg.MsgId = data.MsgId[0];
                instance.emit("voice", msg);
                break;
            case 'video' :
                msg.MediaId = data.MediaId[0];
                msg.ThumbMediaId = data.ThumbMediaId[0];
                msg.MsgId = data.MsgId[0];
                instance.emit("video", msg);
                break;               
            case 'location' : 
                msg.Location_X = data.Location_X[0];
                msg.Location_Y = data.Location_Y[0];
                msg.Scale = data.Scale[0];
                msg.Label = data.Label[0];
                msg.MsgId = data.MsgId[0];      
                instance.emit("location", msg);
                break;
            case 'link' : 
                msg.Title = data.Title[0];
                msg.Description = data.Description[0];
                msg.Url = data.Url[0];
                msg.MsgId = data.MsgId[0];
                instance.emit("link", msg);
                break;
            case 'event' : 
                msg.Event = data.Event[0];
                msg.EventKey = data.EventKey[0];
                instance.emit("event", msg);
                break;
            }
        });
        return msg;
    }

    /*
    将微信消息的处理再度封装
    */
    //监听文本信息
    onText(callback) {
        this.once("text", callback);
        return this;
    }

    //监听图片信息
    onImage(callback) {
        this.once("image", callback);
        return this;
    }

    //监听地址信息
    onLocation(callback) {
        this.once("location", callback);
        return this;
    }

    //监听链接信息
    onLink(callback) {
        this.once("link", callback);
        return this;
    }

    //监听事件信息
    onEvent(callback) {
        this.once("event", callback);
        return this;
    }

    //监听语音信息
    onVoice(callback) {
        this.once("voice", callback);
        return this;
    }

    //监听视频信息
    onVideo(callback) {
        this.once("video", callback);
        return this;
    }
    /*
    将json对象根据微信的格式转为XML
    */
    toXML(data) {
        var MsgType = "";
        if (!data.MsgType) {
            if (data.hasOwnProperty("Content")) MsgType = "text";
            if (data.hasOwnProperty("MusicUrl")) MsgType = "music";
            if (data.hasOwnProperty("Articles")) MsgType = "news";
        } else {
            MsgType = data.MsgType;
        }
        var msg = "" +
            "<xml>" +
            "<ToUserName><![CDATA[" + data.ToUserName + "]]></ToUserName>" +
            "<FromUserName><![CDATA[" + data.FromUserName + "]]></FromUserName>" +
            "<CreateTime>" +Math.round(Date.now()/1000) + "</CreateTime>" +
            "<MsgType><![CDATA[" + MsgType + "]]></MsgType>";

            switch(MsgType) {
                case 'text' : msg+= ""+"<Content><![CDATA[" + (data.Content || '') + "]]></Content>" + "</xml>";
                    return msg;
                case 'image' :
                    msg += "" +
                        "<Image>" +
                        "<MediaId><![CDATA[" + data.MediaId +"]]></MediaId>" +
                        "</Image>" +
                        "</xml>";
                    console.log(msg);
                    return msg;
                case 'voice' :
                    msg += "" +
                        "<Voice>" +
                        "<MediaId><![CDATA[" + data.MediaId +"]]></MediaId>" +
                        "<Title><![CDATA[" + data.Title +"]]></Title>" +
                        "<Description><![CDATA[" + data.Description +"]]></Description>" +
                        "</Voice>" +
                        "</xml>";
                    return msg;
                case 'video' :
                    msg += "" +
                        "<Video>" +
                        "<MediaId><![CDATA[" + data.MediaId +"]]></MediaId>" +
                        "</Video>" +
                        "</xml>";
                    return msg;
                case 'music' :
                    msg += "" +
                        "<Music>" +
                        "<Title><![CDATA[" + (data.Title || '') + "]]></Title>" +
                        "<Description><![CDATA[" + (data.Description || '') + "]]></Description>" +
                        "<MusicUrl><![CDATA[" + (data.MusicUrl || '') + "]]></MusicUrl>" +
                        "<HQMusicUrl><![CDATA[" + (data.HQMusicUrl || data.MusicUrl || '') + "]]></HQMusicUrl>" +
                        "<ThumbMediaId><![CDATA[" + (data.ThumbMediaId || '') + "]]></ThumbMediaId>" +
                        "</Music>" +
                        "</xml>";
                        console.log(msg);
                    return msg;
                case 'news' : 
                    var ArticlesStr = "";
                    var ArticleCount = data.Articles.length;
                    for (var i in data.Articles) {
                        ArticlesStr += "" +
                        "<item>" + 
                            "<Title><![CDATA[" + (data.Articles[i].Title || '') + "]]></Title>" + 
                            "<Description><![CDATA[" + (data.Articles[i].Description || '') + "]]></Description>" + 
                            "<PicUrl><![CDATA[" + (data.Articles[i].PicUrl || '') + "]]></PicUrl>" + 
                            "<Url><![CDATA[" + (data.Articles[i].Url ||'') + "]]></Url>" + 
                        "</item>";
                    }
                    msg += "<ArticleCount>" + ArticleCount + "</ArticleCount><Articles>" + ArticlesStr + "</Articles></xml>";
                    return msg;
            }
        }
    /*
    发送回复的消息
    */
    reply(data) {
        this._res.setHeader('Content-Type','text/plain');
        this._res.write(this.toXML(data));
        this._res.end();
    }
}
   

exports=module.exports = WechatApi;