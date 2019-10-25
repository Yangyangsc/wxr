/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const UPDATE_PRODUCT_STATUS = "update ec_product set product_sale_status=? where product_id=?"
class ProductModel extends daoBase {
    get getByIdSql() {return "select ec_product.*,richtext.rich_text from ec_product "+
                             " left join bas_richtext richtext on ec_product.product_id=richtext.data_id and richtext.bus_type=2 "+
                             " where ifnull(rec_isdeleted,0)=0 and product_id=? ";}
    get updateSql() {return "update ec_product set ? where product_id=?";}
    get insertSql() {return "insert into ec_product set ?";}
    get deleteSql() {return "update ec_product set rec_isdeleted=1 WHERE find_in_set(product_id,?)";}
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
    ///设置商品上下架销售
    setProductSalesStatus(id,status){
        if (status==null) status=0;
        return this.database.executeSql(UPDATE_PRODUCT_STATUS,[status,id]);
    }
}
exports = module.exports = ProductModel;