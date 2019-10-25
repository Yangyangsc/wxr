/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');

class RichtextModel extends daoBase {
    get getByIdSql() {return "select * from bas_richtext where bus_type=? and data_id=? ";}
    get delete() {return "delete from bas_richtext where bus_type=? and data_id=? ";}
    get updateRichText() {return "update bas_richtext set rich_text=? where bus_type=? and data_id=? ";}
    get insertRichText() {return "insert into bas_richtext set bus_type=?,data_id=?,rich_text=?";}
    ///根据主键获取一条记录
    getBykey(type,id) {
        return this.database.executeSql(this.getByIdSql, [type,id]);
    }
    ///插入记录
    create(type,id,text){
        return this.database.executeSql(this.insertRichText,[type,id,text]);
    }
    ///更新记录
    update(type,id,text){
        return  this.database.executeSql(this.updateRichText,[text,type,id]);
    }
    ///删除记录
    delete(type,id) {
        return this.database.executeSql(this.delete, [type,id]);
    }
}
exports = module.exports = RichtextModel;