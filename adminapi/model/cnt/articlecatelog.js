/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const getcatelogs = "select catelog_id as id,parent_id as pid,catelog_name as text,catelog_image as image "+
                       " from cnt_catelog where rec_isdeleted=0 order by catelog_index";
const CHANGE_PARENT_CATELOG = "update cnt_catelog set parent_id=? where catelog_id=?"
class ArticlecatelogModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  CNT_CATELOG WHERE IFNULL(REC_ISDELETED,0)=0 AND CATELOG_ID=? ";}
    get updateSql() {return "update CNT_CATELOG set ? where CATELOG_ID=?";}
    get insertSql() {return "insert into CNT_CATELOG set ?";}
    get deleteSql() {return "UPDATE CNT_CATELOG SET REC_ISDELETED=1 WHERE find_in_set(CATELOG_ID,?)";}
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
    getCatelogs(){
        return this.database.executeSql(getcatelogs);
    }
     ///更换上级目录
    ChangeParentCatelog(catelogid,parentid){
        if (utility.isNullOrEmpty(parentid)) parentid=null;
        return this.database.executeSql(CHANGE_PARENT_CATELOG,[parentid,catelogid]);
    }

}
exports = module.exports = ArticlecatelogModel;