/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const SET_KOL_DISABLE="update brh_kol set kol_disabled=? where kol_id=?";
class KOLModel extends daoBase {
    get getByIdSql() {return "select * from  brh_kol where kol_id=? ";}
    get updateSql() {return "update brh_kol set ? where kol_id=?";}
    get insertSql() {return  "insert into brh_kol set ?"; }
    get deleteSql() {return "update brh_kol set rec_isdeleted=1 where find_in_set(kol_id,?)";}
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
    setKolDisabled(kolid,disabled=1){
        return  this.database.executeSql(SET_KOL_DISABLE,[disabled,kolid]);
    }
}
exports = module.exports = KOLModel;