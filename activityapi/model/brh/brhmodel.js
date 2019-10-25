/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var daoBase = require('../../core/database/daoBase');
const GET_KOL_LIST = `SELECT bk.kol_id,bk.kol_name,bk.kol_cover,bk.kol_company,bk.kol_title,bk.kol_describ,bk.kol_value,bk.kol_price,bk.rec_create_date,
                             bk.rec_creator,bk.rec_update_date,bk.rec_updator,bk.rec_isdeleted
                        FROM
                        brh_kol AS bk
                        WHERE bk.kol_disabled=0 and bk.rec_isdeleted=0`;
const USER_LOGIN = `SELECT
                        be.enterprise_id AS id,
                        be.enterprise_name AS name,
                        be.enterprise_eng_name AS en_name,
                        be.enterprise_logo AS logo,
                        be.enterprise_account AS account,
                        be.enterprise_level AS level,
                        DATE_FORMAT(be.enterprise_join_date,'%Y/%m/%d') AS join_date,
                        DATE_FORMAT(be.enterprise_end_date,'%Y-%m-%d %H:%i') AS end_date
                    FROM
                        framework.brh_enterprise AS be
                    WHERE be.enterprise_account=? AND be.enterprise_password=? AND be.enterprise_disabled=0 AND be.rec_isdeleted=0`;
const APPLICATION_SERVICE = `call proc_BRH_ApplyService(?,?,?,?,@returnValue);`
const GET_MY_SERVICE = `call proc_BRH_GetMyService(?);`;
const UPDATE_USER_PASSWORD = `UPDATE framework.brh_enterprise SET enterprise_password = ? WHERE enterprise_id=? AND enterprise_password=?;`;
const GET_MY_APPLYS = `call proc_BRH_GetMyApply(?);`;
const GET_MEDIAS_BY_LEVEL = "CALL proc_BRH_GetMediasByLevel(?,?,?);"
const GET_MEDIA_DETAIL_BY_NO = "CALL proc_BRH_GetMediaDetail(?,?,?);"

class BrhModel extends daoBase {
    getKols() {
        return this.database.executeSql(GET_KOL_LIST);
    }

    login(account, password) {
        return this.database.executeSql(USER_LOGIN, [account, password]);
    }

    applyService(userid, serviceid, apptype, appdataid) {
        return this.database.executeSql(APPLICATION_SERVICE, [serviceid, userid, apptype, appdataid]);
    }

    getMyServices(userid) {
        return this.database.executeSql(GET_MY_SERVICE, userid);
    }

    updatePassword(userid, password, newpassword) {
        return this.database.executeSql(UPDATE_USER_PASSWORD, [newpassword, userid, password]);
    }

    getMyApplys(userid) {
        return this.database.executeSql(GET_MY_APPLYS, userid);
    }

    getMedias(level, page, rows) {
        return this.database.executeSql(GET_MEDIAS_BY_LEVEL, [level, page, rows]);
    }

    getMediaDetail(mediano, startdate, enddate) {
        return this.database.executeSql(GET_MEDIA_DETAIL_BY_NO, [mediano, startdate, enddate]);
    }
}
exports = module.exports = BrhModel; 