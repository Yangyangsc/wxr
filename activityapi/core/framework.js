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

    }
}
exports = module.exports = LiteCoderFramework;