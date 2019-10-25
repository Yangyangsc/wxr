var cache = require('memory-cache');
var co = require('co');

class MemoryCache {
    static set(key, value, expire) {
        return co(function* () {
            return cache.put(key, value, expire);
        });
    }

    static get(key) {
        return co(function* () {
            return cache.get(key);
        });
    }
}

exports = module.exports = MemoryCache;