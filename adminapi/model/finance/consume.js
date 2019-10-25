/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const GET_CONSUME_SUMMARY = "select ifnull(sum(pay_total),0) as total from fw_payment pay "+
                            "inner join crm_user user on pay.user_id=user.user_id "+
                            "where pay.pay_status=1 " 
class ConsumeModel extends daoBase {
    ///根据主键获取一条记录
    getConsumeTotal(filter) {
        if (utility.isNullOrEmpty(filter)) filter='';
        return this.database.executeSql(GET_CONSUME_SUMMARY+filter);
    }
}
exports = module.exports = ConsumeModel;