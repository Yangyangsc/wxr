/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const GET_SLIDER_IMAGES="select image_id,image_topic,image_subtitle,image_url,image_platform,DATE_FORMAT(image_start,'%Y-%m-%d') as image_start,DATE_FORMAT(image_end,'%Y-%m-%d') as image_end,image_disabled from portal_slider_image where slider_id=? order by image_index";
class SliderModel extends daoBase {
    get getByIdSql() {return "select * from  portal_slider where slider_id=? ";}
    get updateSql() {return "update portal_slider set ? where slider_id=?";}
    get insertSql() {return "insert into portal_slider set ?";}
    get deleteSql() {return "update portal_slider set rec_isdeleted=1 WHERE find_in_set(slider_id,?)";}
    ///根据用户登录账号获取用户
    get getByKey() {
        return "select count(1) as total from portal_slider where slider_key=? and rec_isdeleted=0"
    }
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
    ///获取幻灯分组下的所有图片
    getSliderImages(sliderid){
        return this.database.executeSql(GET_SLIDER_IMAGES,sliderid);
    }
    ///看是否有相同的key
    getSameKeyCount(key,id=null){
        let sql = this.getByKey;
        if (id) sql=sql+" and slider_id<>'"+id+"'";
        return this.database.executeSql(sql,key);
    }
	query(Sql,model){
        return this.database.executeSql(Sql, model);
    }
}
exports = module.exports = SliderModel;