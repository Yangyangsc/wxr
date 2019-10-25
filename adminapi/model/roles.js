/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');
var utility = require('../core/utilities/utilities');
var apiResult = require('../core/result/actionResult');

const DELETE_USERROLE = "delete from fw_userrole where user_id=? and role_id=?";
const GET_ROLE_USERS ="select ur.rec_id as id,u.user_id as userid,u.user_name as name from fw_userrole ur inner join fw_users u on ur.user_id=u.user_id where role_id=? and u.rec_isdeleted=0";
class RolesModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  FW_ROLES WHERE IFNULL(REC_ISDELETED,0)=0 AND ROLE_ID=? ";}
    get updateSql() {return "update FW_ROLES set ? where ROLE_ID=?";}
    get insertSql() {return "insert into FW_ROLES set ?";}
    get deleteSql() {return "UPDATE FW_ROLES SET REC_ISDELETED=1 WHERE find_in_set(ROLE_ID,?)";}
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
    //获取某角色下的所有用户
    getRoleUsers(roleUid){
        return  this.database.executeSql(GET_ROLE_USERS,roleUid);
    }
}
exports = module.exports = RolesModel;