const daoBase = require('../../core/database/daoBase');
const MEMBER_CREATE = "call proc_MEMBER_Create(?,?,?,?,?,?,?,?,?,?,@returnValue);";
const MEMBER_DETAIL = "call proc_MEMBER_DetailAndLevel(?,?);";
const MEMBER_JOIN = "call proc_MEMBER_Join(?,?,?,?,?,?,?,?,?,@returnValue);";
const GET_ORDER_AMOUNT = "call proc_MEMBER_GetAmount(?,?,?,@result,@amount,@userextend);";
const FINISH_ORDER = "call proc_MEMBER_FinishOrder(?,?,?,@result);";
const GET_MEMBER_TYPE = `SELECT cmt.member_id,cmt.member_name,cmt.member_desc,cmt.member_price,cmt.member_level,
                            cmt.member_poster,cmt.share_title,cmt.share_image FROM	crm_membership_type AS cmt
                        WHERE cmt.member_id=? AND cmt.rec_isdeleted=0`;
const GET_USER_INFO = `SELECT cu.user_id,cu.user_name,cu.user_image,cu.user_mobile,cu.user_city,cu.user_sex,cu.user_corp_name,
                            cu.user_corp_position,cu.user_education,cu.user_memo,cu.user_serial,cu.user_mobile,cu.user_real_name,
                            (SELECT count(cum.rec_id) FROM crm_user_member AS cum WHERE cum.user_id=cu.user_id) AS vip_count
                        FROM crm_user AS cu
                        WHERE cu.user_id=? AND cu.user_disabled=0`;
const GET_USER_ADDRESS = `select address_id,user_id,city_id,city_name,district_id,district_name,address_name,
                            recipient,address_default,mobile
                        from crm_user_address as cua where cua.user_id = ?
                        order by address_default desc
                        limit 5`;
const EDIT_USER_ADDRESS = "call proc_MEMBER_EditAddress(?,?,?,?,?,?,?,?,?,?,?,@resultValue);";
const DEL_USER_ADDRESS = "DELETE FROM crm_user_address WHERE address_id=? AND user_id=?;";
const GET_USER_BY_PLATFORM = "call proc_MEMBER_GetInfoByPlatform(?,?);";
const GET_ADDRESS_DETAIL = `select cua.address_id,cua.recipient,cua.mobile,cua.city_id,cua.city_name,
                                cua.district_id,cua.district_name,cua.address_name,cua.address_default
                            from crm_user_address as cua
                            where cua.user_id=? and cua.address_id=?`;
const GET_OPENID_BY_USERID = "select cp.platform_user_ext as openid from crm_platform as cp where cp.platform_type=0 and cp.user_id=?";
const EDIT_USER_INFO = `update crm_user set user_image=?,user_mobile=?,user_name=?,user_real_name=?,
                         user_sex=?,user_corp_name=?,user_corp_position=? 
                      where user_id=?`;
const CREATE_QR = "call proc_WECHAT_CreateQr(?,?,?,?,?,@id)";
const UPDATE_QR = "UPDATE wechat_qrcode SET qr_ticket=?,return_data=? where qr_id=?";
const GET_WC_QR = "call proc_WECHAT_GetWCQr(?,?,?);";
const FINISH_QR = "update wechat_qrcode set qr_status=1 where qr_id=?";
const GET_USER_SIMPLE = `select cu.user_id,cu.user_name,cu.user_real_name,cu.user_mobile,
                        DATE_FORMAT(cu.user_create_date,'%Y-%m-%d %H:%i') as user_create_date,cu.user_serial
                        from crm_user as cu where cu.user_id=?`;
const CHECK_USER_IS_MEMBER = `SELECT count(cum.rec_id) as vip_count FROM crm_user_member as cum 
                            where cum.user_id=?
                                and cum.member_id=?
                                and (cum.valid_forever=1 or (cum.valid_start<now() and cum.valid_end>now()))`;



class MemberModel extends daoBase {
    getDetail({ userid, memberid }) {
        return this.database.executeSql(MEMBER_DETAIL, [userid, memberid]);
    }

    create({ userid, username, userimg, usercity, usersex = 1, thirdid, platformtype, platformuserid, platformdata, platformuserext }) {
        return this.database.executeSql(MEMBER_CREATE, [userid, username, userimg, usercity, usersex, thirdid, platformtype, platformuserid, platformdata, platformuserext]);
    }

    joinMember(params) {
        return this.database.executeSql(MEMBER_JOIN, params);
    }

    getMemberPrice({ userid, orderid, platformtype = 0 }) {
        return this.database.executeSql(GET_ORDER_AMOUNT, [userid, orderid, platformtype]);
    }

    finishOrder(params) {
        return this.database.executeSql(FINISH_ORDER, params);
    }

    getMemberType(memberid) {
        return this.database.executeSql(GET_MEMBER_TYPE, memberid);
    }

    getUserInfo(userid) {
        return this.database.executeSql(GET_USER_INFO, userid);
    }

    getUserAddress(userid) {
        return this.database.executeSql(GET_USER_ADDRESS, userid);
    }

    editUserAddress(params) {
        return this.database.executeSql(EDIT_USER_ADDRESS, params);
    }

    getAddressDetail(userid, addrid) {
        return this.database.executeSql(GET_ADDRESS_DETAIL, [userid, userid]);
    }

    deleteUserAddress(userid, addrid) {
        return this.database.executeSql(DEL_USER_ADDRESS, [addrid, userid]);
    }

    getUserByPlatform(platformtype, platformuserid) {
        return this.database.executeSql(GET_USER_BY_PLATFORM, [platformtype, platformuserid]);
    }

    getOpenidByUser(userid) {
        return this.database.executeSql(GET_OPENID_BY_USERID, userid);
    }

    editUser(params) {
        return this.database.executeSql(EDIT_USER_INFO, params);
    }

    createQR({ qrtype = 0, bustype = 0, busid, userid, expseconds = 0 }) {
        return this.database.executeSql(CREATE_QR, [qrtype, bustype, busid, userid, expseconds]);
    }

    updateQr({ ticket, retdata, qrid }) {
        return this.database.executeSql(UPDATE_QR, [ticket, retdata, qrid]);
    }

    getQr(qrid, openid, status = -1) {
        return this.database.executeSql(GET_WC_QR, [qrid, openid, status]);
    }

    dealQr(qrid) {
        return this.database.executeSql(FINISH_QR, qrid);
    }

    getQrByOpenid(openid) {
        return this.database.executeSql(FINISH_QR, qrid);
    }

    getUserSimple(userid) {
        return this.database.executeSql(GET_USER_SIMPLE, userid);
    }
	
    isMember(userid, memberid) {
        return this.database.executeSql(CHECK_USER_IS_MEMBER, [userid, memberid]);
    }
}
exports = module.exports = MemberModel;