/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');
const getFunction = "select fun_id as id,fun_parent_id as pid,fun_name as text,fun_url as url,fun_type as type,fun_icon as icon,fun_disabled as disable "+
                       " from fw_function where rec_isdeleted=0 order by fun_index";
const SET_FUNCTION_STATUS = "update fw_function set fun_disabled=? where fun_id=?";
const GET_FUNC_PRIVILEGE = "select rec_id,fun_id,p.user_id,p.role_id,u.user_name,r.role_name,"+
                            "(case when p.user_id is not null then 0 else 1 end) as type,right_data as privilege,"+
                            "(case when p.fun_id=? then 0 else 1 end) as inherit "+
                            "from fw_function_privilege p "+
                            "left join fw_users u on p.user_id= u.user_id and u.rec_isdeleted=0 "+
                            "left join fw_roles r on p.role_id = r.role_id and r.rec_isdeleted=0 "+
                            "where find_in_set(p.fun_id,fun_getFunctionParentsList(?)) order by p.role_id"
const ADD_FUNC_PRIVILEGE = "insert into fw_function_privilege(rec_id,fun_id,user_id,role_id,right_data) values ";
class FunctionModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  FW_FUNCTION WHERE IFNULL(REC_ISDELETED,0)=0 AND FUN_ID=? ";}
    get updateSql() {return "update FW_FUNCTION set ? where FUN_ID=?";}
    get insertSql() {return "insert into FW_FUNCTION set ?";}
    get deleteSql() {return "UPDATE FW_FUNCTION SET REC_ISDELETED=1 WHERE find_in_set(FUN_ID,?)";}
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

    ///获取所有系统功能
    getFunctions(){
        return this.database.executeSql(getFunction);
    }

    ///设置系统功能的可用状态
    setDisbled(funUid,disable=1){
        return this.database.executeSql(SET_FUNCTION_STATUS,[disable,funUid]);
    }
    ///获取某个菜单的权限列表
    getFuncPrivileges(funUid){
        return this.database.executeSql(GET_FUNC_PRIVILEGE,[funUid,funUid]);
    }
    ///为菜单添加权限
    addFunctionPrivilege(funUid,userid,roleid){
        let sqlCommand='';
        userid.split(',').forEach(uid=>{
            if (uid=='') return;
            sqlCommand += "(uuid(),'"+funUid+"','"+uid+"',null,0),"
        })
        roleid.split(',').forEach(rid=>{
            if (rid=='') return;
            sqlCommand += "(uuid(),'"+funUid+"',null,'"+rid+"',0),"
        })
        if (sqlCommand.length>0) sqlCommand = sqlCommand.substr(0,sqlCommand.length-1);
        console.log(ADD_FUNC_PRIVILEGE+sqlCommand);
        return this.database.executeSql(ADD_FUNC_PRIVILEGE+sqlCommand);
    }
}
exports = module.exports = FunctionModel;