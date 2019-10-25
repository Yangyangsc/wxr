/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
///活动的增票类型
const PUBLISH_ACTIVITY = "update crm_activity set activity_status=1 where activity_id=?";
const GET_PUBLISHED_ACTIVITY_4CHECKIN = "select activity_id as id,activity_cover as cover, activity_city_name as city,"
                                    + " activity_location as location,DATE_FORMAT(activity_date_start,'%Y-%m-%d %H:%i') as startdate,"
                                    + " DATE_FORMAT(activity_date_end,'%Y-%m-%d %H:%i') as enddate, "
                                    + " activity_topic as topic,activity_checkin as ckbutton from crm_activity where "
                                    + " rec_isdeleted=0 and activity_status=1 "
                                    + " and activity_date_end>now() "
                                    + " order by rec_create_date desc";
class CRMActivityModel extends daoBase {
     get getByIdSql() {return "select activity_id,activity.catalog_id,activity_topic,activity_cover,avtivity_share_image,"+
                        " activity_status,activity_label,activity_city,activity_city_name,"+
                        " activity_location,activity_desc,DATE_FORMAT(activity_date_start,'%Y-%m-%d %H:%i') as activity_date_start,"+
                        "  DATE_FORMAT(activity_date_end,'%Y-%m-%d %H:%i') as activity_date_end,DATE_FORMAT(activity_ticket_end,'%Y-%m-%d %H:%i')  as activity_ticket_end,"+
                        " catalog_name,richtext.rich_text,activity_price,activity_member_price from  crm_activity activity "+
                        " left join bas_richtext richtext on activity.activity_id=richtext.data_id and richtext.bus_type=2"+
                        " where ifnull(activity.rec_isdeleted,0)=0  and activity.activity_id=?";}
    get updateSql() {return "update crm_activity set ? where activity_id=?";}
    get insertSql() {return "insert into crm_activity set ?";}
    get deleteSql() {return "update crm_activity set rec_isdeleted=1 where find_in_set(activity_id,?)";}

    getActivity4CheckIn(){
        return this.database.executeSql(GET_PUBLISHED_ACTIVITY_4CHECKIN);
    }
    ///根据主键获取一条记录
    getBykey(Sql,id) {
        return this.database.executeSql(Sql, id);
    }
    ///插入记录
    create(Sql,model){
        return this.database.executeSql(Sql, model);
    }
    ///更新记录
    update(Sql,model,id){
        return  this.database.executeSql(Sql,[model,id]);
    }
    ///删除记录
    delete(Sql,id){
        return this.database.executeSql(Sql,id);
    }
    ///发布活动
    publishActivity(id){
        return this.database.executeSql(PUBLISH_ACTIVITY,id);
    }
}
exports = module.exports = CRMActivityModel;