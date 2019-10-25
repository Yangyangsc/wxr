/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');

class ArticleModel extends daoBase {
    get getByIdSql() {return "select article.*,log.catelog_name,richtext.rich_text from  cnt_article article "+
                             "inner join cnt_catelog log on article.catelog_id=log.catelog_id "+
                            "left join bas_richtext richtext on article.article_id=richtext.data_id and richtext.bus_type=0 "+
                            "where ifnull(article.rec_isdeleted,0)=0  and article.article_id=? ";}
    get updateSql() {return "update CNT_ARTICLE set ? where ARTICLE_ID=?";}
    get insertSql() {return "insert into CNT_ARTICLE set ?";}
    get deleteSql() {return "UPDATE CNT_ARTICLE SET REC_ISDELETED=1 WHERE find_in_set(ARTICLE_ID,?)";}
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
}
exports = module.exports = ArticleModel;