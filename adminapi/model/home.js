/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');
var apiResult = require('../core/result/actionResult');

const GET_SYSTEM_STATISTICS = "call proc_MAS_GetSysReport(?,?);";

class HomeModel extends daoBase {
    //获取某角色下的所有用户
    getSysStatistics({ startDate, endDate } = { startDate: new Date() }) {
        return this.database.executeSql(GET_SYSTEM_STATISTICS, [startDate, endDate]);
    }
}
exports = module.exports = HomeModel;