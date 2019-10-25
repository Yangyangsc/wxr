var jwt = require('jwt-simple');
var apiResult = require("../core/result/actionResult");
var config = require("../core/configuration/frameworkConfig");

module.exports.checkAuthorization = function (req, res, next) {
    //规定登录的路由跳过
    if (req.path.toLowerCase() == "/login") return next();

    ///从Post的Body里面或者QueryString里面或者Header里面去获取
    ///前端传递过来的access_token
    var token = (req.body && req.body.access_token) ||
        (req.query && req.query.access_token) ||
        req.headers['authorization'];
    if (token) {
        ///检查Token 是否有效
        var decoded = jwt.decode(token, config.getSetting('TokenCryptKey'));
        ///检查是否过期
        if (decoded.exp <= Date.now()) return res.json(apiResult.TOKEN_IS_EXPIRED);
        req.user = decoded.iss;
        next();
    } else {
        return res.json(apiResult.UNAUTHORIZATION_RESULT);
    }
}