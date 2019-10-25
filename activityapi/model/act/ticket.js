/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const GET_DETIAL = "call proc_BUS_GetTicketDetail2(?,?,?,?,?);";

class ActivityticketModel extends daoBase {
    getDetialForOrder(params) {
        return this.database.executeSql(GET_DETIAL, params)
    }
}
exports = module.exports = ActivityticketModel;