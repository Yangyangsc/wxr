/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const getcatalogs = "select catalog_id as id,parent_id as pid,catalog_name as text,catalog_image as image "+
                       " from ec_product_catalog where rec_isdeleted=0 order by catalog_index";
const CHANGE_PARENT_catalog = "update ec_product_catalog set parent_id=? where catalog_id=?"
class ProductcatalogModel extends daoBase {
    get getByIdSql() {return "select * from  ec_product_catalog where ifnull(rec_isdeleted,0)=0 and catalog_id=? ";}
    get updateSql() {return "update ec_product_catalog set ? where catalog_id=?";}
    get insertSql() {return "insert into ec_product_catalog set ?";}
    get deleteSql() {return "update ec_product_catalog set rec_isdeleted=1 where catalog_id=?";}
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
     ///获取所有内容栏目
    getCatalogs(){
        return this.database.executeSql(getcatalogs);
    }
     ///更换上级目录
    ChangeParentcatalog(catalogid,parentid){
        if (utility.isNullOrEmpty(parentid)) parentid=null;
        return this.database.executeSql(CHANGE_PARENT_catalog,[parentid,catalogid]);
    }

}
exports = module.exports = ProductcatalogModel;