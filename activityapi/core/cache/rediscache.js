var redis = require('redis');
var wrapper = require('co-redis');
var config = require('../../configuration.json');

var redisClient = redis.createClient(config.redisConnections);
//redis连接错误
redisClient.on('error', function (err) {
    console.log(err);
});
var redisCo = wrapper(redisClient);
class RedisCache {
    /**修改选择的redis数据库 */
    static select(dbNum) {
        redisClient.select(6);
    }

    /**设置string
     * key  键
     * value 值
     * expire 过期时长单位毫秒
     */
    static set(key, value, expire) {
        if (expire < 1000) return Promise.reject(new Error("过期时间不能小于一秒"));
        let promise;
        if (!expire)
            promise = redisCo.set(key, value);
        else
            promise = redisCo.setex(key, expire / 1000, value)
        return promise;
    }
    /**获取string */
    static get(key) {
        return redisCo.get(key);
    }
}
exports = module.exports = RedisCache;