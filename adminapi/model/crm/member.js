/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
var moment=require('moment');
const SET_MEMBER_DISABLE="update crm_user set user_disabled=? where user_id=?"
const GET_MEMBER_GROUPS="select ug.user_id,ug.group_id, gp.group_name,gp.group_image,gp.group_type,DATE_FORMAT(ug.join_date,'%Y-%m-%d') as join_date,ug.group_title,ug.user_is_admin from crm_group_user ug inner join crm_group gp on ug.group_id=gp.group_id where ug.user_id=? order by gp.group_index ";
const JOIN_GROUP= "insert into crm_group_user(group_id,user_id,join_date,group_title) values ";
const REMOVE_MEMBER_FROM_GROUP = "delete from crm_group_user where group_id=? and user_id=?";
const GET_USER_MEMBERTYPE = "select rec_id,DATE_FORMAT(join_date,'%Y-%m-%d') as join_date,valid_forever,DATE_FORMAT(valid_start,'%Y-%m-%d') as valid_start,DATE_FORMAT(valid_end,'%Y-%m-%d') as valid_end,user_guide_by,user_guide_name,mt.member_level,mt.member_name from crm_user_member um "+
                            "inner join crm_membership_type mt on "+
                            "um.member_id=mt.member_id where um.user_id=? and (valid_forever=1 or (valid_forever=0 and valid_start<=now() and valid_end>=now() ))  order by join_date desc";
const GET_USER_LABEL = "select rec_id,label_name as label,label_count as count from crm_user_label ul "+
                       " inner join bas_label lb on ul.label_id=lb.label_id "+
                       " where user_id=? and lb.label_disabled=0 order by label_count desc limit 20;"
const GET_USER_TOTAL_CONSUME = "select sum(pay_total) as total from fw_payment where user_id=? and pay_status=1 "
class MemberModel extends daoBase {
    get getByIdSql() {return "SELECT * FROM  CRM_USER WHERE USER_ID=? ";}
    get updateSql() {return "update CRM_USER set ? where USER_ID=?";}
    get insertSql() {return "insert into CRM_USER set ?";}
    get deleteSql() {return "DELETE FROM CRM_USER WHERE find_in_set(USER_ID,?)";}
    get getUserMemberTypeSql() {return "select * from crm_user_member where rec_id=?"}
    get insertUserMemberTypeSql() {return "insert into crm_user_member set ?"}
    get updateUserMemberTypeSql() {return "update crm_user_member set ? where rec_id=?"}
    get deleteUserMemberTypeSql() {return "delete from crm_user_member where rec_id=?"}
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
    //删除记录
    delete(Sql,id){
        return this.database.executeSql(Sql,id);
    }
    ///设置会员的可用状态
    setMemberDisabled(userId,disabled=1){
        return  this.database.executeSql(SET_MEMBER_DISABLE,[disabled,userId]);
    }

    getMemberGroupsInfo(userId){
        return  this.database.executeSql(GET_MEMBER_GROUPS,userId);
    }
    ///获取用户所加入的会员
    getUserMemberTypes(id){
        return  this.database.executeSql(GET_USER_MEMBERTYPE,id);
    }
    ///将用户加入到群
    joinGroup(groupId,userId){
        // var mode = {group_id:groupId,user_id:userId};
        // return  this.database.executeSql(JOIN_GROUP,mode);
        var sqlCommand ='';
        var groups = groupId.split(',');
        groups.forEach((group,index)=>{
            if (utility.isNullOrEmpty(group)) return ;
            sqlCommand=sqlCommand+",('"+group+"','"+userId+"',now(),'成员')"
        })
        if (sqlCommand.length<=0) return Promise.resolve({successed:false});
        sqlCommand=sqlCommand.substring(1);
        console.log(JOIN_GROUP+sqlCommand);
        return this.database.executeSql(JOIN_GROUP+sqlCommand)
                            .then(result=>{ return {successed:true,joindate:moment().format('YYYY-MM-DD')}})
    }
    ///将用户从群里面移除
    removeFromGroup(groupId,userId){
        return  this.database.executeSql(REMOVE_MEMBER_FROM_GROUP,[groupId,userId]);
    }


    ///获取会员用户的兴趣分布
    getUserLabelInfo(id){
        return this.database.executeSql(GET_USER_LABEL,id);
    }
    ////获取用户的总计消费
    getUserTotalConsume(id,type,startDate,endDate){
        var whereClause ='';
        if (!utility.isNullOrEmpty(type)) whereClause+=' and order_type ='+type;
        if (!utility.isNullOrEmpty(startDate)) whereClause+=" and pay_date >='"+startDate+" 00:00:00' ";
        if (!utility.isNullOrEmpty(endDate)) whereClause+=" and pay_date <='"+endDate+" 23:59:59' ";
        return this.database.executeSql(GET_USER_TOTAL_CONSUME+whereClause,id);
    }
}
exports = module.exports = MemberModel;