/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const GET_DISCOUNT = "select channel_name,channel_discount,channel_memo from act_channel where channel_coupon=? and channel_disabled=0 and rec_isdeleted2=0;";

class ActivityticketModel extends daoBase {
    getDiscountById(code) {
        return this.database.executeSql(GET_DISCOUNT, code)
    }
}
exports = module.exports = ActivityticketModel;