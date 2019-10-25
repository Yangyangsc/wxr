var config = require('../../configuration.json');
var utility = require('../utilities/utilities');


var cache = require('../cache/' + utility.checkValue(config.cacheHandler, 'memorycache'));

class CacheUtility {
    static setUser(token, userObject, expire) {
        if (typeof userObject != "string") userObject = JSON.stringify(userObject);
        return cache.set(token, userObject, expire);
    }
    ///从缓存中获取用户
    static getUser(token) {
        return cache.get(token).then(result => {
            var userInfo = JSON.parse(result);
            return userInfo;
        });
    }
    //缓存验证码
    static setVerifyCode(key, code, expire = 600000) {
        return cache.set(key, code, expire);
    }
    //获取验证码
    static getVeryfiyCode(key) {
        return cache.get(key);
    }
}
exports = module.exports = CacheUtility;