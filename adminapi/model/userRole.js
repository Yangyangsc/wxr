/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');
var uuid= require('node-uuid');
var utility = require('../core/utilities/utilities');
class UserRoleModel extends daoBase {
    get insertSql() {return "insert into FW_USERROLE(rec_id,user_id,role_id) values ";}
    get deleteSql() {return "DELETE FROM FW_USERROLE WHERE find_in_set(REC_ID,?)";}
    ///插入记录
    create(userid,roleid){
         userid = utility.checkValue(userid,'');
         roleid = utility.checkValue(roleid,'');
        
        var userItems = userid.split(',');
        var roleItem = roleid.split(',');
        if (roleItem.length<=0 || userItems.length<=0) Promise.reject(apiResult.API_PARAMETERS_ERROR_RESULT);
        var recordCount =  Math.max(userItems.length,roleItem.length);
        var recids = [];
        for(var nindex=0;nindex<recordCount;nindex++)
            recids.push(uuid.v4());
        if (userItems.length>1 && roleItem.length==1)
            return this.addUsers2Role(recids,roleItem[0],userItems);
        else if (roleItem.length>1 && userItems.length==1)
            return this.addRoles2User(recids,userItems[0], roleItem);
        else if (roleItem.length==1 && userItems.length==1)
            return this.addRoles2User(recids,userItems[0], roleItem);
        return Promise.reject(apiResult.API_PARAMETERS_ERROR_RESULT);
    }
   
    ///删除记录
    delete(Sql,id){
        return this.database.executeSql(Sql,id);
    }

    ///添加用户到角色
    addUsers2Role(recids,roleid,userItem){
        var sqlCommand ='';

        userItem.forEach((user,index)=>{
            if (utility.isNullOrEmpty(user)) return ;
            sqlCommand=sqlCommand+",('"+recids[index]+"','"+user+"','"+roleid+"')"
        })
        if (sqlCommand=='') return Promise.resolve({successed:false});
        sqlCommand=sqlCommand.substring(1);
        console.log(this.insertSql+sqlCommand);
        return this.database.executeSql(this.insertSql+sqlCommand)
                 .then(result=>{ return {successed:true,records:recids}})
    }

    ///添加用户到角色
    addRoles2User(recids,userid,roleItem){
        var sqlCommand ='';
        roleItem.forEach((role,index)=>{
            if (utility.isNullOrEmpty(role)) return ;
            sqlCommand=sqlCommand+",('"+recids[index]+"','"+userid+"','"+role+"')"
        })
        if (sqlCommand=='') return Promise.resolve({successed:false});
        sqlCommand=sqlCommand.substring(1);
        console.log(this.insertSql+sqlCommand);
        return this.database.executeSql(this.insertSql+sqlCommand)
               .then(result=>{ return {successed:true,records:recids}})
    }
}
exports = module.exports = UserRoleModel;