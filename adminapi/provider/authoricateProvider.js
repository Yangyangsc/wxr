/*
* 用户认证&相关权限的中间件处理
* 权限控制尚未写
*/
var jwt = require('jwt-simple');
var apiResult = require("../core/result/actionResult");
var crypto = require('crypto');
var utility = require('../core/utilities/utilities');
var userModel = require('../model/user');
var userCache = require('../core/utilities/cacheUtility');
var config = require("../core/configuration/frameworkConfig");
var securityProvider = require('./securityProvider');
/*
验证当前的Token的合法性
*/
module.exports.CheckAccessToken = function (token) {
    if (token) {
        try {
            ///检查Token 是否有效
            var decoded = jwt.decode(token, config.getSetting('TokenCryptKey'));
            ///检查是否过期
            if (decoded.exp <= Date.now()) res.json(apiResult.TOKEN_IS_EXPIRED);
            return userCache.getUser(decoded.iss);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    return Promise.reject(new Error("用户未登录"));
}

module.exports.checkAuthorization = function (req, res, next) {
    ///从Post的Body里面或者QueryString里面或者Header里面去获取
    ///前端传递过来的access_token
    var token = (req.body && req.body.access_token) ||
        (req.query && req.query.access_token) ||
        req.headers['authorization'];
    if (token) {
        try {
            ///检查Token 是否有效
            var decoded = jwt.decode(token, config.getSetting('TokenCryptKey'));
            ///检查是否过期
            if (decoded.exp <= Date.now()) return res.json(apiResult.TOKEN_IS_EXPIRED);
            userCache.getUser(token).then(function (data) {
                if (!data) return res.json(apiResult.UNAUTHORIZATION_RESULT);
                req.user = data;
                ///current url is a security object for user
                ///So check current user have privilege to visit the interface
                if (config.getSetting("security", 'false').toLowerCase() == 'true') {
                    var securityItem = req.user.security;
                    if (securityItem) {
                        var routeKey = req.method.toUpperCase() + '_' + req.route.path;
                        if (securityItem[routeKey]) 
                        {
                            var securityInfo = securityItem[routeKey];
                            if (securityInfo.access & 0x01 > 0 || securityInfo.access & 0x02 == 0) res.json(apiResult.NO_ACCESS_RIGHT_RESULT);
                            var security = {};
                            security.filterSyntax = securityInfo.filterSyntax;
                            security.disableControl = securityInfo.disableControl;
                            security.unvisibleControl = securityInfo.unvisibleControl;
                            req.security = security;
                        }
                    }
                }
                next();
            }).catch(function (err) {
                return res.json(apiResult.TOKEN_IS_INVALID);
            });
        }
        catch (err) {
            return res.json(apiResult.TOKEN_IS_INVALID);
        }
    } else {
        return res.json(apiResult.UNAUTHORIZATION_RESULT);
    }
//    return res.json(apiResult.UNAUTHORIZATION_RESULT);
}

module.exports.validateUser = function* (username, password) {
    ///通过md5加密
    //let cryptoMode = utility.checkValue(config.getSetting("crypto"), 'md5');
    let hasherPassword = password;// crypto.createHash(cryptoMode).update(password).digest('hex');
    var User = new userModel();
    let loginResult = yield User.userLogin(username, hasherPassword);
    ///没有找到用户或用户密码错误
    if (!loginResult.successed) return loginResult;
    //if (loginResult.rows.length == 0) return Promise.reject({ successed: false, errorcode: errcode.LOGIN_ERROR.USER_NOT_FOUND, message: "User not found" });
    ///找到用户了，确定密码是否正确
    let user = loginResult.user;
    ///密码完全匹配，则登录成功
    var returnData = {
        successed: true,
        user: {
            id: user.user_id,
            deptid: user.dept_id,
            account: username,
            name: user.user_name,
            photo: user.user_photo
        }
    };
    ///获取用户可以使用的功能
    var functionResult = loginResult.functions;
    // var functionResult = yield User.getUserFunctions(user.user_id,0);
    if (functionResult) {
        var functions = yield utility.hierarchyItems(functionResult, "id", "pid", ["id", "pid", "url", "icon", "name", "target"]);
        returnData.user.functions = functions;
    }
    ///将所有安全对象的信息也加载出来
    if (utility.checkValue(config.getSetting("security"), 'false').toLowerCase() == 'true') {
        var securityObjects = loginResult.privilege; //yield securityProvider.getSecurityForUser(user.user_id);
        ///合并同类的安全权限设置
        var combinedResult = yield securityProvider.combineSecurities(securityObjects, returnData.user);
        returnData.user.security = combinedResult;
    }
    return returnData;
};


/*
    检查用户对平台定义的安全路由加载
*/
module.exports.securityUrlValidate = function (req, res, next) {

}