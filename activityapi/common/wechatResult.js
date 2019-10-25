var pfenum = require('./enum');

class WeChatResult {
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
WeChatResult.URL_LOSE = { successed: false, errmessage: 'REDIRECT_URL_LOSE', errorcode: pfenum.WECHAT_ERROR.URL_LOSE };

exports = module.exports = WeChatResult;