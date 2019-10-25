/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../core/database/daoBase');

class SystemSettingModel extends daoBase {
    get getByIdSql() {return "select * from  fw_setting where setting_id=? ";}
    get updateSql() {return "update fw_setting set ? where setting_id=?";}
    ///根据主键获取一条记录
    getBykey(sql,id) {
        return this.database.executeSql(this.getByIdSql, id);
    }
    ///更新记录
    update(sql,model,id){
        return  this.database.executeSql(this.updateSql,[model,id]);
    }
}
exports = module.exports = SystemSettingModel;