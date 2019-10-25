var daoBase = require('../../core/database/daoBase');
const ORDER_CREATE = "call proc_ORDER_Create(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@returnValue);";//
const ORDER_CREATE2 = "call proc_ORDER_Create2(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@returnValue);";//参数多了一个yhq
const ORDER_LIST = "call proc_ORDER_List(?,?,?);";
const GET_ORDER_AMOUNT = "call proc_ORDER_GetAmount(?,@result,@amount);";
const FINISH_ORDER = "call proc_ORDER_Finish(?,?,?,@result);";
const FINISH_ORDER2 = "call proc_ORDER_Finish2(?,?,?,@result);";
const GET_ORDER_TICKET = "call proc_ORDER_GetTicket(?);";


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

    createOrder(params) {
       return this.database.executeSql(ORDER_CREATE2, params);
        // return this.database.executeSql(ORDER_CREATE, params);
    }

    getOrders(params) {
        return this.database.executeSql(ORDER_LIST, params);
    }

    getOrderPrice(orderid) {
        return this.database.executeSql(GET_ORDER_AMOUNT, orderid);
    }

    finishOrder(params) {
        return this.database.executeSql(FINISH_ORDER2, params);
        // return this.database.executeSql(FINISH_ORDER, params);
    }

    getOrderTicket(params) {
        return this.database.executeSql(GET_ORDER_TICKET, params);
    }

    getYhq(sql,params) {
        return this.database.executeSql(sql, params);
    }

    editYhq(sql,params) {
        return this.database.executeSql(sql, params);
    }

    toShare(sql,params) {
        return this.database.executeSql(sql, params);
    }

    update(sql,params) {
        return this.database.executeSql(sql, params);
    }

    query(sql, params){
        return this.database.executeSql(sql, params);
    }
}

exports = module.exports = ActivityModel;