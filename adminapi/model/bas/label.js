/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var util = require('util'); 
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const getlabletree = "select label_id as id,parent_id as pid,label_name as text "+
                       " from bas_label where label_disabled=0 order by label_index";

const getlabelcatalog = "select label_id as id, label_name as name from bas_label "+
                        " where ifnull(parent_id,'')='' and label_disabled=0 order by label_index";


class LabelModel extends daoBase {
    get getByIdSql() {return "select * from  bas_label where label_disabled=0 AND label_id=? ";}
    get updateSql() {return "update bas_label set ? where label_id=?";}
    get insertSql() {return "insert into bas_label set ?";}
    get deleteSql() {return "update bas_label set label_disabled=1 where find_in_set(label_id,?)";}
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
    ///获取标签树
    getAllLables(){
        return this.database.executeSql(getlabletree);
    }
   
    ///获取标签大类
    getlablesCatalog(){
        return this.database.executeSql(getlabelcatalog);
    }

}
exports = module.exports = LabelModel;