var settingjson = require("../../configuration.json");
var utility = require('../utilities/utilities')
class frameworkConfig{
    static getSetting (settingKey,defaultValue) {
       let item= settingjson.appsetting[settingKey];
       return utility.checkValue(item,defaultValue);
    }
    /*
    * 获取配置文件中的数据库连接串
    */
    static getConnection (connName) {
        return settingjson.connections[connName];
    };
}
exports=module.exports = frameworkConfig;