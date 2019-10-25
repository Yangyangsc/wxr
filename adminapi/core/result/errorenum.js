/*
* 常用的API返回错误枚举
*/
///数据库级别的错误 ： FROM 10001 ~ 10100
module.exports.DATABASE_ERROR = {
    DATABASE_CONNECTED_ERROR: 10001,
    DATABASE_EXECUTE_ERROR: 10002,
    NO_RECORD_EFFECTED: 10003,
    NO_RECORD_FOUND: 10004
}
///通用错误 : From 9000~10000
module.exports.COMMON_ERROR = {
    TRANSMIT_TO_VIEW_ERROR: 9000,
    TRANSMIT_TO_DATA_ERROR: 9001,


    VISIT_TO_INDEX: 9002,               //访问跟域名，返回到首页
    API_PARAMETERS_ERROR: 9003,        //API方法调用错误
    VERIFY_CODE_ERROR: 9004,            //验证码错误
    /////权限操作类错误
    NO_ACCESS_RIGHT: 9100,               //没有访问权限
    TOKEN_IS_MISSING: 9997,
    TOKEN_EXPIRED: 9998,                 //
    TOKEN_IS_INVALID: 9999,              //密匙无效
    UNAUTHORIZATION_ERROR: 10000         //未认证
}
///用户登录错误码
module.exports.LOGIN_ERROR = {
    SUCCESSED: 0,
    USER_NOT_FOUND: 1,
    USER_PASSWORD_ERROR: 2,
    SERIAL_CODE_ERROR: 3,   ///校验码无效
    UNKNOW_ERROR: 4,
    DATABASE_ERROR: 100
};
///获取用户属性错误码
module.exports.GET_USERINFO_ERROR = {
    SUCCESSED: 0,
    USER_NOT_FOUND: 1,
    UNKNOW_ERROR: 2,
    DATABASE_ERROR: 100
};