/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const SET_MEMBER_DISABLE="update brh_enterprise set enterprise_disabled=? where enterprise_id=?";
const EXISTS_ACCOUNT = "select count(1) as count from brh_enterprise where enterprise_account=? and rec_isdeleted=0"
const ENTERPRISE_SERVICE = "select rec_id,bas.service_id as serviceid,enterprise_id as entid,service_name as name,service_remain as remain from brh_service inner join brh_bas_service bas on brh_service.service_id=bas.service_id where enterprise_id=?";
const SET_ENTERPRISE_SERVICE_COUNT = "update brh_service set service_remain=? where rec_id=?";
const SET_ENTERPRISE_PASSWORD = "update brh_enterprise set enterprise_password=? where  enterprise_id=?";
const DELETE_ENTERPRISE_SERVICE = "delete from brh_service where rec_id=?";
const INSERT_ENTERPRISE_SERICE = "insert into brh_service(enterprise_id,service_id,service_remain) values";
class EnterpriseModel extends daoBase {
    get getByIdSql() {return "select * from  brh_enterprise where enterprise_id=? ";}
    get updateSql() {return "update brh_enterprise set ? where enterprise_id=?";}
    get batchUpdateSCSql() {return "replace into brh_service(rec_id,enterprise_id,service_id,service_remain) values";}
    get insertSql() {
        return  "insert into brh_enterprise set ?;"+
                "insert into brh_service(enterprise_id,service_id,service_remain) "+
                "select enterprise_id,service_id, "+
                "(case enterprise_level when 1 then service_count1 else service_count2 end ) "+
                "as addsum from brh_enterprise,brh_bas_service "+
                "where (service_level & brh_enterprise.enterprise_level)>0 "+
                " and brh_enterprise.rec_isdeleted=0 and brh_enterprise.enterprise_id=";
        }
    get deleteSql() {return "update brh_enterprise set rec_isdeleted=1 where find_in_set(enterprise_id,?)";}
    ///根据主键获取一条记录
    getBykey(Sql,id) {
        return this.database.executeSql(Sql, id);
    }
    ///插入记录
    create(Sql,model){
        Sql = Sql+"'"+model.enterprise_id+"'";
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
    ///获取到企业会员所有的服务券
    getEnterpriseService(id){
        return this.database.executeSql(ENTERPRISE_SERVICE,id);
    }
    ///设置会员的可用状态
    setEnterpriseDisabled(enterpriseId,disabled=1){
        return  this.database.executeSql(SET_MEMBER_DISABLE,[disabled,enterpriseId]);
    }
    existAccount(account){
        return this.database.executeSql(EXISTS_ACCOUNT,account)
                .then(result => {
                    var existed = result.rows[0].count>0;
                    return { successed: true, existed:existed};
                })
                .catch(result => { return result; });
    }
    setServiceCount(id,count){
        return  this.database.executeSql(SET_ENTERPRISE_SERVICE_COUNT,[count,id]);
    }
     ///重设会员的密码
    resetPassword(id,password){
        return this.database.executeSql(SET_ENTERPRISE_PASSWORD,[password,id]);
    }

    deleteService(id){
        return this.database.executeSql(DELETE_ENTERPRISE_SERVICE,id);
    }
    insertService(batchInsertSql){
        if (utility.isNullOrEmpty(batchInsertSql)) return {successed:false};
        return this.database.executeSql(INSERT_ENTERPRISE_SERICE+batchInsertSql);
    }
    batchUpdateService(batchSql){
        if (utility.isNullOrEmpty(batchSql)) return {successed:false};
        var fullSql = this.batchUpdateSCSql+batchSql;
        return this.database.executeSql(fullSql);
    }

}
exports = module.exports = EnterpriseModel;