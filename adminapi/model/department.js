/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var util = require('util'); 
var daoBase = require('../core/database/daoBase');
var utility = require('../core/utilities/utilities');
const getdepartments = "select dept_id as id,dept_parent_id as pid,dept_name as text,dept_code as code "+
                       " from fw_department where rec_isdeleted=0 order by dept_index";
const CHANGE_PARENT_DEPARTMENT = "update fw_department set dept_parent_id=? where dept_id=?"
class DepartmentModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  FW_DEPARTMENT WHERE IFNULL(REC_ISDELETED,0)=0 AND DEPT_ID=? ";}
    get updateSql() {return "update FW_DEPARTMENT set ? where DEPT_ID=?";}
    get insertSql() {return "insert into FW_DEPARTMENT set ?";}
    get deleteSql() {return "UPDATE FW_DEPARTMENT SET REC_ISDELETED=1 WHERE find_in_set(DEPT_ID,?)";}
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
    ///获取所有部门
    getDepartments(){
        return this.database.executeSql(getdepartments);
    }
    ///更换部门的上级部门
    ChangeHeaderDepartment(deptid,parentid){
        if (utility.isNullOrEmpty(parentid)) parentid=null;
        return this.database.executeSql(CHANGE_PARENT_DEPARTMENT,[parentid,deptid]);
    }


}
exports = module.exports = DepartmentModel;