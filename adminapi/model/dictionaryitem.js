/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');

class DictionaryitemModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  FW_DICT_ITEM WHERE REC_ID=? ";}
    get updateSql() {return "update FW_DICT_ITEM set ? where REC_ID=?";}
    get insertSql() {return "insert into FW_DICT_ITEM set ?";}
    get deleteSql() {return "DELETE FROM FW_DICT_ITEM WHERE find_in_set(REC_ID,?)";}
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
exports = module.exports = DictionaryitemModel;