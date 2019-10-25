/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');

class AttachmentModel extends daoBase {
    get getByBusiness() {return "select file_id as id,file_url as url,file_name as name,file_size as size,file_ext as ext,file_default as isdefault from  bas_attachment where ifnull(rec_isdeleted,0)=0 and bus_type=? and bus_id=? order by file_upload_date desc";}
    get updateSql() {return "update BAS_ATTACHMENT set ? where FILE_ID=?";}
    get insertSql() {return "insert into BAS_ATTACHMENT set ?";}
    get deleteSql() {return "UPDATE BAS_ATTACHMENT SET REC_ISDELETED=1 WHERE find_in_set(FILE_ID,?)";}
    ///插入记录
    create(Sql,model){
        return this.database.executeSql(Sql, model);
    }
    ///删除记录
    delete(Sql,id){
        return this.database.executeSql(Sql,id);
    }

    getAttachmentsByBusiness(busType,busId){
         return this.database.executeSql(this.getByBusiness,[busType,busId]);
    }

}
AttachmentModel.Business = {
    TAOBAO_STORE : 50
}
exports = module.exports = AttachmentModel;