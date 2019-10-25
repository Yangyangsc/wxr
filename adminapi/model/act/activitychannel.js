/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const GET_CHANNEL_GIFTS= "select g.rec_id as id,g.channel_id as channel,t.ticket_title as title,t.ticket_discount_price as price,t.ticket_bgcolor as bgcolor,"
                         +" g.gift_count as count,g.gift_memo as memo from act_channel_gift g "
                         +" inner join act_ticket t  on g.ticket_id=t.ticket_id "
                         +" where g.channel_id=? order by t.ticket_index";
class ActivitychannelModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  ACT_CHANNEL WHERE IFNULL(REC_ISDELETED,0)=0 AND CHANNEL_ID=? ";}
    get updateSql() {return "update ACT_CHANNEL set ? where CHANNEL_ID=?";}
    get insertSql() {return "insert into ACT_CHANNEL set ?";}
    get deleteSql() {return "UPDATE ACT_CHANNEL SET REC_ISDELETED=1 WHERE find_in_set(CHANNEL_ID,?)";}
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
    ///获取渠道的赠票信息
    getChannelGifts(id){
        return this.database.executeSql(GET_CHANNEL_GIFTS,id);
    }
}
exports = module.exports = ActivitychannelModel;