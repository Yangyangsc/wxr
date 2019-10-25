/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const SET_IMAGE_STATUS = "update portal_slider_image set image_disabled=? where image_id=?";
class SliderImageModel extends daoBase {
    get getByIdSql() {return "select * from  portal_slider_image where image_id=? ";}
    get updateSql() {return "update portal_slider_image set ? where image_id=?";}
    get insertSql() {return "insert into portal_slider_image set ?";}
    get deleteSql() {return "delete from portal_slider_image where find_in_set(slider_id,?)";}
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
    ///设置图片的启用状态
    setImageDisabled(imageid,disabled=1){
         return this.database.executeSql(SET_IMAGE_STATUS,[disabled,imageid]);
    }
}
exports = module.exports = SliderImageModel;