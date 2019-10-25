/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var util = require('util'); 
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');
const MEDIA_TYPE_SQL = "select rec_id as id,item_name as name,ifnull(m.totalcount,0) as totalcount  from fw_dict_item dict "+
                       "left join "+
                       "(select media_content_type, count(1) as totalcount from bas_media  where rec_isdeleted=0 group by media_content_type) m "+
                       "on dict.rec_id=m.media_content_type "+
                       "where dict_id='7793eac3-56b8-4535-a492-a094884808ba' "+
                       "order by item_value";
class MediaModel extends daoBase {
    get getByIdSql() {return "select * from bas_media where rec_isdeleted=0 and media_id=? ";}
    get updateSql() {return  "update bas_media set ? where media_id=?";}
    get insertSql() {return  "insert into bas_media set ?";}
    get deleteSql() {return  "update bas_media set rec_isdeleted=1 where find_in_set(media_id,?)";}
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
    ///获取到媒体的分类信息
    getMediaContentType(){
        return this.database.executeSql(MEDIA_TYPE_SQL);
    }
}
exports = module.exports = MediaModel;