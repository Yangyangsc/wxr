/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');
const get_item_by_dictname_sql = "select rec_id,item_name,item_value from fw_dict_item "+
                            "inner join fw_dict on fw_dict_item.dict_id=fw_dict.dict_id "+
                            "where fw_dict.dict_name =? order by item_value";
class DictionaryModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  FW_DICT WHERE IFNULL(REC_ISDELETED,0)=0 AND DICT_ID=? ";}
    get updateSql() {return "update FW_DICT set ? where DICT_ID=?";}
    get insertSql() {return "insert into FW_DICT set ?";}
    get deleteSql() {return "UPDATE FW_DICT SET REC_ISDELETED=1 WHERE find_in_set(DICT_ID,?)";}
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
    getDictionaryItems(dictname){
        return this.database.executeSql(get_item_by_dictname_sql,dictname);
    }

}
exports = module.exports = DictionaryModel;