/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const GET_PRODUCT_LIST = "call proc_EC_GetProducts();";
const GET_PRODUCT_DETAIL = "call proc_EC_GetProductsDetail(?,?,@returnValue);";
const GET_EC_ORDERS = "call proc_EC_OrderList(?);"
const EC_ORDER_CREATE = "call proc_EC_CreateOrder(?,?,?,?,?,?,?,@retValue);";
const GET_EC_ORDER_PRICE = "call proc_EC_OrderAmount(?,?);"
const EC_FINISH_ORDER = "call proc_EC_FinishOrder(?,?,@result);";

class ECModel extends daoBase {
    getProducts() {
        return this.database.executeSql(GET_PRODUCT_LIST);
    }

    getProductDetail({ userid, productid }) {
        return this.database.executeSql(GET_PRODUCT_DETAIL, [userid, productid]);
    }

    getOrderList(userid) {
        return this.database.executeSql(GET_EC_ORDERS, userid);
    }

    createOrder(params) {
        return this.database.executeSql(EC_ORDER_CREATE, params);
    }

    getOrderPrice({ userid, orderid }) {
        return this.database.executeSql(GET_EC_ORDER_PRICE, [userid, orderid]);
    }

    finishOrder(params) {
        return this.database.executeSql(EC_FINISH_ORDER, params);
    }
}
exports = module.exports = ECModel; 