var model = require('../model/user')
var controllerBase = require('../core/controllerBase')
var util = require('util')
var request = require('request')
var bodyParser = require('body-parser')
var qs = require('qs')

function WeChatController () {
  // this.setInstance(this, new model())
  // this.daoModel = new model()
}
/* 微信登陆 */
var AppID = 'wx2168e72523959a1d' // '<你的测试号或正式号appid>'
var AppSecret = '7aab4d21ca22f1acd2b1121d8edb8cb7' // '<你的测试号或正式号appsecret>'
WeChatController.prototype.wechatLogin = function (req, res) {

  // 第一步：用户同意授权，获取code
  var router = '/oauth/getToken' // wechatcontroller 配置地址
  // 这是编码后的地址 用户确认后跳转的地址

  var return_uri = encodeURIComponent('http://www.15emall.com/' + router)
  var scope = 'snsapi_userinfo'

  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect')
}
WeChatController.prototype.getUnionID = function (req, res, token, openid) {
  var reqUrl = 'https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&'
  var params = {
    access_token: token,
    openid: openid
  }

  var options = {
    method: 'get',
    url: reqUrl + qs.stringify(params)
  }
  console.log(options.url)
  return new Promise((resolve, reject) => {
    request(options, function (err, res, body) {
      if (res) {
        resolve(body)
      } else {
        reject(err)
      }
    })
  })
}
WeChatController.prototype.render = function (req, res) {
  // console.log("get_wx_access_token")
  // console.log("code_return: "+req.query.code)

  // 第二步：通过code换取网页授权access_token
  var code = req.query.code
  request.get(
    {
      url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' + AppSecret + '&code=' + code + '&grant_type=authorization_code'
    },
    function (error, response, body) {
      if (response.statusCode == 200) {

        // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
        // console.log(JSON.parse(body))
        var data = JSON.parse(body)
        var access_token = data.access_token
        var openid = data.openid

        request.get(
          {
            url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN'
          },
          function (error, response, body) {
            if (response.statusCode == 200) {

              // 第四步：根据获取的用户信息进行对应操作
              var userinfo = JSON.parse(body)
              // console.log(JSON.parse(body))
              console.log('获取微信信息成功！')

              // 小测试，实际应用中，可以由此创建一个帐户
              res.send('\
                    <h1>' + userinfo.nickname + " 的个人信息</h1>\
                    <p><img src='" + userinfo.headimgurl + "' /></p>\
                    <p>" + userinfo.city + '，' + userinfo.province + '，' + userinfo.country + '</p>\
                ')
            }else {
              console.log(response.statusCode)
            }
          }
        )
      }else {
        console.log(response.statusCode)
      }
    })
}
WeChatController.prototype.getToken = function (req, res) {
  var reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?'
  var params = {
    appid: AppID,
    secret: AppSecret,
    code: req.query.code,
    grant_type: 'authorization_code'
  }

  var options = {
    method: 'get',
    url: reqUrl + qs.stringify(params)
  }
  console.log(options.url)
  return new Promise((resolve, reject) => {
    request(options, function (err, res, body) {
      if (res) {
        resolve(body)
      } else {
        reject(err)
      }
    })
  })
}
/*
*通过以下方式重载基类的对应方法
*/
// UserController.prototype.beforeGetListData = function (req, res, sql, parameters) {
//    var sqlbase = this.__proto__.__proto__.beforeGetListData(req, res, sql, parameters)
//    return { sql: sql +';SELECT FOUND_ROWS();', parameters: parameters }
// }
util.inherits(WeChatController, controllerBase)
exports = module.exports = WeChatController
