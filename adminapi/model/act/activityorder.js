/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const CHECKIN="call proc_order_checkin(?,?,?,@returnValue); ";
class ActivityOrderModel extends daoBase {
     get getOrderCheckInInfo() {
                    return "select t.ticket_title as ticket,t.ticket_bgcolor as bgcolor, t.ticket_data as data,o.ticket_count as count,r.user_name as name,r.user_company as company,r.user_mobile as mobile,r.user_position as position,"+
                           " (select count(1) from act_order_checkin where order_id=? and checkin_type=?) as checkedsum"+
                            " from act_orders o"+
                            " inner join act_ticket t on o.ticket_id=t.ticket_id"+
                            " inner join act_enroll r on o.enroll_id= r.enroll_id"+
                            " where order_id=? and o.activity_id=? and o.payment_status=1";}
    
    ///扫码获取到票的信息
    getOrderTicketInfo(orderid,checkintype,activityid){
        return this.database.executeSql(this.getOrderCheckInInfo,[orderid,checkintype,orderid,activityid])
            .then(result => {
                if (result.rows != null && result.rows.length == 1)
                {
                    var ticketinfo = result.rows[0];
                    ///当前签到类型不包含票的类型
                    if ((ticketinfo.data & checkintype)==0)  return { successed: false, errorcode: 2 };
                    ///票多次签到，已超过购买的数量
                    if (ticketinfo.count<=ticketinfo.checkedsum)  return { successed: false, errorcode: 3 }; 
                    return { successed: true,rows:ticketinfo};
                }
                return { successed: false, errorcode: 1 };
            })
            .catch(result => {return { successed: false,errorcode:10000};});
    }
    ///签到票务
    checkin(orderid,checkintype,checkuser){
        return this.database.executeSql(CHECKIN, [orderid, checkintype,checkuser])
            .then(result => {
                ///return errored login
                var retValuePosition = result.rows.length - 2;
                var retValue = result.rows[retValuePosition][0].result;
                return { successed: retValue==0, errorcode: retValue };
            })
            .catch(result => {return { successed: false,errorcode:10000};});
    }
    
}
exports = module.exports = ActivityOrderModel;