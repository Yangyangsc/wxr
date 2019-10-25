var express = require('express');
var router = express.Router();
var wechat = require('../third_part/WechatApi');
var co= require('co');
//var bodyParser = require('body-parser');
// var app = express();
// require('body-parser-xml')(bodyParser);
// // 解决微信支付通知回调数据
// app.use(bodyParser.xml({
//   limit: '1MB',   // Reject payload bigger than 1 MB 
//   xmlParseOptions: {
//     normalize: true,     // Trim whitespace inside text nodes 
//     normalizeTags: true, // Transform tags to lowercase 
//     explicitArray: false // Only put nodes in array if >1 
//   }
// }));
/*
公众号授权登录
*/
router.get('/wechat/authorization',function(req,res){
    co(function*(){
        var wxApi = new wechat(req,res);
        var authorizationResult =yield wxApi.getAuthorizationToken(req.query.code);
        var apiTokenResult = yield wxApi.updateAccessToken();
        var userResult =yield wxApi.getUserInfo(apiTokenResult.access_token,authorizationResult.openid);
        return userResult
    }).then(result=>console.log(result))
    .catch(result=>console.log(result));
    

    // wechatHelper.getAuthorizationToken(req.query.code)
    // .then(result=>{
    //     let jsonResult = JSON.parse(result);
    //     console.log(result);
    //     ////根据返回的Access_token和openid 获取用户的信息
    //     wechatHelper.getUserInfo(jsonResult.access_token,jsonResult.openid)
    //     .then(result=>console.log(result));
        
    // })
    // .catch(result=>console.log(result));
})
/* wexin sin. */
router.use('/wechat',wechat.validateSignature,function(req,res){
    var helper = new wxApi(req,res);
    helper.handlerEvent(req,res);
    helper.onText(data=>{
        var msg = {
            FromUserName : data.ToUserName,
            ToUserName : data.FromUserName,
            MsgType : "music",
            Title : "三生三世十里桃花-凉凉",
            Description:"三生三世十里桃花主题曲",
            MusicUrl:"http://cdn.15emall.com/upload/music/liang.mp3"
            // MsgType : "text",
            // Content : "Hello I know , who are U",
            //FuncFlag : 0
            }
         helper.reply(msg);
    });
});


module.exports = router;