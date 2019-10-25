/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const PROCESS_ORDER = "update ec_product_order set process_status=1,process_result=?,process_date=now(),process_user=?,process_opinion=? where order_id=?";
const GET_ORDER_DETAIL = "select d.item_id,d.order_id,d.product_id,d.unit_price,d.order_count,p.product_name,p.product_image from ec_product_order_detail d inner join ec_product p on p.product_id=d.product_id where order_id=?";
class ProductOrderModel extends daoBase {
    get getByIdSql() {return "select order_id,order_no,DATE_FORMAT(order_date,'%Y-%m-%d %H:%i') as order_date,"+
                             "member_level,receive_info,order_total,pay_status,pay_type,pay_date,process_status,"+
                             "DATE_FORMAT(process_date,'%Y-%m-%d %H:%i') as process_date,process_result,process_opinion,"+
                             "order_is_refund,refund_reason,DATE_FORMAT(refund_date,'%Y-%m-%d %H:%i') as refund_date"+
                             ",u.user_name as processuser,cu.user_mobile,cu.user_name,cu.user_image "+
                             "from ec_product_order po inner join crm_user cu on po.user_id=cu.user_id "+
                             "left join fw_users u on  po.process_user = u.user_id where order_id=?";}
                             
    get updateSql() {return "update ec_product set ? where product_id=?";}
    ///根据主键获取一条记录
    getBykey(Sql,id) {
        return this.database.executeSql(Sql, id);
    }

    ///更新记录
    update(Sql,model,id){
        return  this.database.executeSql(Sql,[model,id]);
    }

    ///设置订单处理状态
    processOrder(id,result,user,opinion){
        return this.database.executeSql(PROCESS_ORDER,[result,user,opinion,id]);
    }

    ///获取订单的详细内容
    getOrderDetail(id){
        return this.database.executeSql(GET_ORDER_DETAIL,id);
    }
}
exports = module.exports = ProductOrderModel;