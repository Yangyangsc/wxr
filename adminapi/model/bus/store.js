/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');

class StoreModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  BUS_STORE WHERE IFNULL(REC_ISDELETED,0)=0 AND STORE_ID=? ";}
    get updateSql() {return "update BUS_STORE set ? where STORE_ID=?";}
    get insertSql() {return "insert into BUS_STORE set ?";}
    get deleteSql() {return "UPDATE BUS_STORE SET REC_ISDELETED=1 WHERE find_in_set(STORE_ID,?)";}
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
}
exports = module.exports = StoreModel;