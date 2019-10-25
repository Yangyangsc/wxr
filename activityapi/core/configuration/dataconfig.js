/*
* dataconfig配置文件的处理模块
*/
var utility = require('../utilities/utilities');
class dataConfig
{
    /*
    *根据名称获取到配置中的对应节
    */
    static getConfig(itemName,cfgType=0) {
        if (cfgType==0) return dataConfig.getDataConfig(itemName);
        return dataConfig.getCommonConfig(itemName)
    }

    static getDataConfig(itemName) {
        this.cache = this.cache || {};
        var setting = this.cache[itemName];
        if (!setting)
        {
            var configuration = require('../../dataconfig.json');
            if (!configuration) throw new Error("Data Config File Missing!");
            this.cache[itemName] = setting = configuration[itemName];
        }
        return this.cache[itemName];
    }

    static getCommonConfig(itemName) {
        this.cacheCommon = this.cacheCommon || {};
        var setting = this.cacheCommon[itemName];
        if (!setting)
        {
            var configuration = require('../../simplecommon.json');
            if (!configuration) throw new Error("simplecommon File Missing!");
            this.cacheCommon[itemName] = setting = configuration[itemName];
        }
        return this.cacheCommon[itemName];
    }
}
module.exports = dataConfig;
