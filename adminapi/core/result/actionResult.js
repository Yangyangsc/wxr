var errnum = require('./errorenum')

class ActionResult {
    constructor({ successed = true, errcode = 0, errmessage = '', data = [] }) {
        return { successed: successed, errorcode: errorcode, errmessage: errmessage, data: data }
    }
    //*为结果添加一些附加的值
    static decorateResult(result, opts) {
        Object.keys(opts).forEach(key => {
            result[key] = opts[key];
        });
        return result;
    }
}
ActionResult.DB_CONNECTED_FAILED = { successed: false, errmessage: 'DB_CONNECTED_FAILED', errorcode: errnum.DATABASE_ERROR.DATABASE_CONNECTED_ERROR };
ActionResult.DB_EXECUTE_FAILED = { successed: false, errorcode: errnum.DATABASE_ERROR.DATABASE_EXECUTE_ERROR };
ActionResult.DB_NO_EFFECTIVE = { successed: false, errmessage: 'DB_NO_EFFECTIVE', errorcode: errnum.DATABASE_ERROR.NO_RECORD_EFFECTED };
ActionResult.DB_NO_RECORD_FOUND = { successed: false, errmessage: 'DB_NO_RECORD_FOUND', errorcode: errnum.DATABASE_ERROR.NO_RECORD_FOUND };

ActionResult.SUCCESS_RESULT = { successed: true, errorcode: 0 };
ActionResult.RETURN_TO_INDEX = { successed: false, errorcode: errnum.COMMON_ERROR.VISIT_TO_INDEX };
ActionResult.TOKEN_IS_EXPIRED = { successed: false, errmessage: 'TOKEN_IS_EXPIRED', errorcode: errnum.COMMON_ERROR.TOKEN_EXPIRED };
ActionResult.TOKEN_IS_INVALID = { successed: false, errmessage: 'TOKEN_IS_INVALID', errorcode: errnum.COMMON_ERROR.TOKEN_IS_INVALID };
ActionResult.TOKEN_IS_MISSING = { successed: false, errmessage: 'TOKEN_IS_MISSING', errorcode: errnum.COMMON_ERROR.TOKEN_IS_MISSING };
ActionResult.UNAUTHORIZATION_RESULT = { successed: false, errmessage: 'UNAUTHORIZATION_RESULT', errorcode: errnum.COMMON_ERROR.UNAUTHORIZATION_ERROR };
ActionResult.NO_ACCESS_RIGHT_RESULT = { successed: false, errmessage: 'NO_ACCESS_RIGHT_RESULT', errorcode: errnum.COMMON_ERROR.NO_ACCESS_RIGHT };
ActionResult.API_PARAMETERS_ERROR_RESULT = { successed: false, errmessage: 'API_PARAMETERS_ERROR_RESULT', errorcode: errnum.COMMON_ERROR.API_PARAMETERS_ERROR };
ActionResult.VERIFY_CODE_ERROR = { successed: false, errmessage: 'VERIFY_CODE_ERROR', errorcode: errnum.COMMON_ERROR.VERIFY_CODE_ERROR };



exports = module.exports = ActionResult;
/*
* 返回的对象实例
* 
{
   success：? ,  (boolean type) //结果是否成功 
   id:? ,        (字符)         //返回的数据id (一般为单笔数据)
   errorcode:? , (int)          //错误码 : 0 代表无错误，成功  否则参考实际调用的错误知识
   errormessage:?,(string)      //错误描述
   extend:?       (object)      //扩展信息  
}
*
*/
// class ActionResult
// {
//     static get DB_EXECUTE_FAILED_RESULT() {return {success:false,errorcode:errnum.DATABASE_ERROR.DATABASE_EXECUTE_ERROR}};
//     static get SUCCESS_RESULT() {return {success:true,errorcode:0}};
//     constructor(success,errcode,errmessage)
//     {
//         this.successed = success;
//         this.errorcode = errcode;
//         this.errormessage=errmessage;
//         this.toast = errmessage;
//     }
//     setExtendInfo(extinfo)
//     {
//         this.extend = this.ext || {};
//         this.extend = extinfo;
//     }
// }
// module.exports =
//     {
//         DB_EXECUTE_FAILED_RESULT: { successed: false, errorcode: errnum.DATABASE_ERROR.DATABASE_EXECUTE_ERROR },
//         SUCCESS_RESULT: { successed: true, errorcode: 0 }
//     }