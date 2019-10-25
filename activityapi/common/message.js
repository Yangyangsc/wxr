const rpc = require("../core/rpc/rpcUtility");
const validator = require("validator");
const util = require('util');
const msgConfig = require("../message.json");
const config = require("../configuration.json");
const smsConfig = config.sms;

class Message {
    static SMS(parameters, serviceUrl = "http://sdk.zhongguowuxian.com:98/ws/LinkWS.asmx?wsdl", funcName = "BatchSend") {
        if (!parameters || !parameters.Mobile || !parameters.Content
            || !validator.isMobilePhone(parameters.Mobile, "zh-CN")) {
            return Promise.reject(new Error("参数错误！"));
        }
        return rpc.callWebService(serviceUrl, funcName, Object.assign(parameters, smsConfig));
    }
};
exports = module.exports = Message;