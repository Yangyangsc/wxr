/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const GET_DETIAL = "call proc_BUS_GetActivityDetail(?,?,?,?);";
const ACTIVITY_LIST = "call proc_ACT_GetActivityList(?);";

class ActivityModel extends daoBase {
    get getByIdSql() {
        return "select activity.*,log.catalog_name,richtext.rich_text from  act_activity activity " +
            "inner join act_catalog log on activity.catalog_id=log.catalog_id " +
            "left join bas_richtext richtext on activity.activity_id=richtext.data_id and richtext.bus_type=1 " +
            "where ifnull(activity.rec_isdeleted,0)=0  and activity.activity_id=? ";
    }
    ///根据主键获取一条记录
    getBykey(Sql, id) {
        return this.database.executeSql(Sql, id);
    }

    getDetialById(id) {
        return this.database.executeSql(GET_DETIAL, id);
    }

    getActivityList(cateid) {
        return this.database.executeSql(ACTIVITY_LIST, cateid);
    }

    query(sql, params){
        return this.database.executeSql(sql, params);
    }
}
exports = module.exports = ActivityModel;