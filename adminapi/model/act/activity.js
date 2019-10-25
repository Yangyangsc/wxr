/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const activityRootUrl='http://activity.huanxinkeji.cn/?';
const GET_ACTIVITY_TICKETS = "select ticket_id as id,ticket_is_gift as gift,ticket_bgcolor as bgcolor,ticket_title as title,ticket_desc as describ,ticket_price as price,ticket_discount_price as disprice,ticket_member_price as memberprice,ticket_data as data,ticket_max as max,ticket_disabled as disabled  from act_ticket where activity_id=? order by ticket_index";
///活动的增票类型
const GET_ACTIVITY_GIFT_TICKETS = "select ticket_id as id,ticket_bgcolor as bgcolor,ticket_title as title,ticket_desc as describ,ticket_discount_price as price from act_ticket where activity_id=? and ticket_is_gift=1 and ticket_disabled=0 order by ticket_index";
const GET_ACTIVITY_PARTNERS = 'call proc_GetActivityChannels(?);';
                            // "select channel_id as id,channel_name as name,channel_discount as discount,"
                            //   //+ "concat('"+activityRootUrl+"activityid=',activity_id,'&channelid=',channel_id) as linkUrl,"
                            //   +" channel_memo as memo,channel_coupon as coupon,channel_disabled as disabled,"
                            //   +"channel_max as max  from act_channel where  activity_id=? and rec_isdeleted=0 order by channel_name";
const PUBLISH_ACTIVITY = "update act_activity set activity_status=1 where activity_id=?";
const GET_PUBLISHED_ACTIVITY_4CHECKIN = "select activity_id as id,activity_cover as cover, activity_city_name as city,"
                                    + " activity_location as location,DATE_FORMAT(activity_date_start,'%Y-%m-%d %H:%i') as startdate,"
                                    + " DATE_FORMAT(activity_date_end,'%Y-%m-%d %H:%i') as enddate, "
                                    + " activity_topic as topic,activity_checkin as ckbutton from act_activity where "
                                    + " rec_isdeleted=0 and activity_status=1 "
                                    //+ " and activity_date_end>now() "
                                    + " order by rec_create_date desc";
const GET_ORDER_DETAIL_SUMMARY = "select ifnull(sum(ticket_count),0) as count,ifnull(sum(order_total),0) as total from act_orders o"+
                                 " left join act_enroll r on o.enroll_id=r.enroll_id "+
                                 " where o.payment_status=1 and o.activity_id = ? ";
const GET_ACTIVITY_TICKET_ANNLYSIS="select t.ticket_id,ticket_title,ifnull(g.ticketcount,0) as count,"
                                    +" ifnull(g.channelcount,0) as channelcount,ifnull(g.tickettotal,0) as total,"
                                    +" ifnull(g.channeltotal,0) as channeltotal  from act_ticket t"
                                    +" left join("
                                    +" select ticket_id,sum(ticket_count) as ticketcount,"
                                    +" sum(IF(ifnull(order_channel,'')='',0,ticket_count)) as channelcount,"
                                    +" sum(order_total) as tickettotal,"
                                    +" sum(IF(ifnull(order_channel,'')='',0,order_total)) as channeltotal"
                                    +" from act_orders"
                                    +" where activity_id=? and payment_status=1 group by ticket_id) g"
                                    +" on t.ticket_id=g.ticket_id"
                                    +" where activity_id=? order by t.ticket_index";
const GET_ACTIVITY_CHECKINBUTTONS = "select activity_topic as topic,activity_cover as cover,activity_checkin as buttons from act_activity where activity_id=? and rec_isdeleted=0 ";
class ActivityModel extends daoBase {
     get getByIdSql() {return "select activity_id,activity.ext_field2,activity_gift_sharetitle,activity_for_member,activity_share_title, activity.catalog_id,activity_topic,activity_cover,avtivity_share_image,"+
                        " activity_status,activity_is_free,label_id,activity_label,activity_city,activity_city_name,"+
                        " activity_location,activity_desc,activity_checkin,DATE_FORMAT(activity_date_start,'%Y-%m-%d %H:%i') as activity_date_start,"+
                        "  DATE_FORMAT(activity_date_end,'%Y-%m-%d %H:%i') as activity_date_end,DATE_FORMAT(activity_ticket_end,'%Y-%m-%d %H:%i')  as activity_ticket_end,"+
                        " activity_sms,log.catalog_name,richtext.rich_text from  act_activity activity "+
                        " inner join act_catalog log on activity.catalog_id=log.catalog_id"+
                        " left join bas_richtext richtext on activity.activity_id=richtext.data_id and richtext.bus_type=1"+
                        " where ifnull(activity.rec_isdeleted,0)=0  and activity.activity_id=?";}
    get updateSql() {return "update act_activity set ? where activity_id=?";}
    get insertSql() {return "insert into act_activity set ?";}
    get deleteSql() {return "update act_activity set rec_isdeleted=1 where find_in_set(activity_id,?)";}

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
    ///获取签到活动的签到按钮
    getActivityCheckInButtons(id){
        return this.database.executeSql(GET_ACTIVITY_CHECKINBUTTONS,id);
    }
    ///获取活动的票务汇总
    getActivityTicketsAnalysis(id){
        return this.database.executeSql(GET_ACTIVITY_TICKET_ANNLYSIS,[id,id]);
    }
    ///获取售票明细的汇总
    getOrderDetailsSummary(userName,gift,ticketId,id){
        var sqlWhere = "";
        if (!utility.isNullOrEmpty(userName)) sqlWhere+=" and (r.user_name like '%"+userName+"%' or r.user_mobile like '%"+userName+"%') "
        if (!utility.isNullOrEmpty(gift)) sqlWhere+=" and order_is_gift = "+gift;
        if (!utility.isNullOrEmpty(ticketId)) sqlWhere+=" and o.ticket_id  = '"+ticketId+"'";
        return this.database.executeSql(GET_ORDER_DETAIL_SUMMARY+sqlWhere,id);
    }
    ///发布活动
    publishActivity(id){
        return this.database.executeSql(PUBLISH_ACTIVITY,id);
    }
    ///获取活动的票务信息设置
    getActivityTickets(id){
        return this.database.executeSql(GET_ACTIVITY_TICKETS,id);
    }
    ///获取活动的赠票信息
    getActivityGiftsTickets(id){
        return this.database.executeSql(GET_ACTIVITY_GIFT_TICKETS,id);
    }
    ///获取活动的渠道合作信息设置
    getActivityChannels(id){
        return this.database.executeSql(GET_ACTIVITY_PARTNERS,id);
    }

    
}
exports = module.exports = ActivityModel;