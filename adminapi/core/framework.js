/*
    轻码框架入口类
    自动加载配置与routerConfig中的路由配置
*/
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var co = require('co');
var jwt = require('jwt-simple');
var utility = require('./utilities/utilities');
var controllerconfig = require('../routerConfig.json');
var config = require('./configuration/frameworkConfig');
var userCache = require('./utilities/cacheUtility');
var apiResult = require('./result/actionResult.js');
var svgCaptcha = require('svg-captcha');
var uuid = require('node-uuid');

class LiteCoderFramework {
    /*
        构造函数
        application ： 当前App实例
        authorizateProvider ： 认证提供者接口
    */
    constructor(application, authorizateProvider) {
        this.app = application;
        ///如果用户认证提供者存在，则注册登录的接口
        if (authorizateProvider) this.registerLoginRouter(this.app, authorizateProvider);
        // this.registerSerialCode(this.app);
        //#账号登录接口，这段代码上线前抹去
        this.app.get('/checkUser', authorizateProvider.checkAuthorization, function (req, res) {
            res.json(req.user);
        });

        ///初始化路由配置,请参考routeConfig.json
        if (controllerconfig) {
            ////遍历配置中的所有Controller
            //let _self = this;
            controllerconfig.forEach(element => {
                //if (!element.routers || element.routers.length == 0) return;
                var modulePath = path.join(__dirname, element.controller);
                ///如果控制器不加载就跳过
                if (element.disabled) return;
                if (fs.existsSync(modulePath)) {
                    var controllModule = require(modulePath);
                    ////该控制器下的所有路由需要身份验证
                    if (authorizateProvider && element.authorize && element.baseUrl) this.app.use(element.baseUrl, authorizateProvider.checkAuthorization);
                    ///加载该控制器
                    var controller = new controllModule(this.app);
                }
            });
        }
    }
    ///注册登录的接口地址
    registerLoginRouter(app, authoricateProvider) {
        //#账号登录接口，需要验证码
        app.post('/login', function (req, res) {
            if (!req.body.verifykey || !req.body.verifycode) {
                res.json(apiResult.VERIFY_CODE_ERROR);
                return;
            }
            userCache.getVeryfiyCode(req.body.verifykey).then(code => {
                if (code != req.body.verifycode.trim().toUpperCase()) {
                    res.json(apiResult.VERIFY_CODE_ERROR);
                    return;
                }
                co(authoricateProvider.validateUser(req.body.username, req.body.password))
                    .then(function (result) {
                        ///登录成功,返回调用的Token给客户端    
                        if (result.successed) {
                            var expires = moment().add(7, 'days').valueOf();
                            var token = jwt.encode({ iss: result.user.id, exp: expires,random:Math.random() }, config.getSetting('TokenCryptKey'));
                            ///save user to cache
                            console.log('user token:' + token);
                            userCache.setUser(token, result.user);
                            result.token = token;
                            result.exp = expires;
                        }
                        res.json(result);
                    })
                    .catch(result => {
                        res.json(result);
                    });
            }).catch(err => {
                res.json(apiResult.VERIFY_CODE_ERROR);
            });
        });
        ////简单的登录接口，取消了验证码的内容
        app.post('/simplelogin', function (req, res) {
            co(authoricateProvider.validateUser(req.body.username, req.body.password))
                .then(function (result) {
                    ///登录成功,返回调用的Token给客户端    
                    if (result.successed) {
                        var expires = moment().add(7, 'days').valueOf();
                        var token = jwt.encode({ iss: result.user.id, exp: expires }, config.getSetting('TokenCryptKey'));
                        ///save user to cache
                        console.log('user token:' + token);
                        userCache.setUser(token, result.user);
                        result.token = token;
                        result.exp = expires;
                    }
                    res.json(result);
                })
                .catch(result => {
                    res.json(result);
                });
        });

        app.get('/serial', function (req, res) {
            var captcha = svgCaptcha.create();
            let key = uuid.v4();
            userCache.setVerifyCode(key, captcha.text.toUpperCase()).then(result => {
                res.json({ successed: true, key: key, code: captcha.data });
            }).catch(err => {
                res.json({ successed: false });
            });
        })
    }
}
exports = module.exports = LiteCoderFramework;