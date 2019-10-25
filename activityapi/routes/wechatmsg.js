const express = require('express');
const router = express.Router();
const config = require('../configuration.json');
const wechat = require('wechat');
const memberModel = require("../model/member/member");
const Wechat = new require("wechat-api");
const co = require('co');


const wechatapi = new Wechat(config.weChat.appID, config.weChat.appSecret);
const wconfig = {
    token: config.weChat.token,
    appid: config.weChat.appID,
    encodingAESKey: config.weChat.encodingAESKey,
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};
router.use('/wechat', wechat(wconfig, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    let message = req.weixin;
    co(function* () {
        if (message.MsgType == "event") {
            let mDao = new memberModel();
            if (message.Event == "SCAN" || (message.EventKey && message.EventKey.startsWith("qrscene_"))) {  // 扫描二维码
                let qrid = message.EventKey.startsWith("qrscene_") ? message.EventKey.replace("qrscene_", "") : message.EventKey;
                let dbQR = yield mDao.getQr(qrid, message.FromUserName);
                if (dbQR && dbQR.rows.length > 0 && dbQR.rows[0].length > 0) {
                    let qrData = dbQR.rows[0][0];
                    // 已经扫描二维码成功的直接返回
                    if (qrData.qr_status == 1) return;
                    if (qrData.qr_bus_type == 0) {    // 模版消息
                        // todo: 模版消息应该通过busid读取模版表进行发送对应信息
                        let dbUser = yield mDao.getUserByPlatform(0, message.FromUserName);
                        if (dbUser && dbUser.rows.length > 0 && dbUser.rows[0].length > 0) {
                            let uData = dbUser.rows[0][0];
                            var tData = {
                                "first": {
                                    "value": uData.user_real_name + " 恭喜你加入会员成功！",
                                    "color": "#173177"
                                },
                                "keyword1": {
                                    "value": uData.user_mobile,
                                    "color": "#173177"
                                },
                                "keyword2": {
                                    "value": uData.user_serial,
                                    "color": "#173177"
                                },
                                "keyword3": {
                                    "value": uData.user_create_date,
                                    "color": "#173177"
                                },
                                "remark": {
                                    "value": "欢迎您加入大家庭！",
                                    "color": "#173177"
                                }
                            };
                            wechatapi.sendTemplate(message.FromUserName, "f6BibWiwenO_Pcj9wSU-X4rJakxJZe238V_tsfvkgLY", "http://activity.huanxinkeji.cn/activity.html?cateid=bf2c83ef-e93e-4bcd-b5bb-7ffa031764e8&slider=activity-top", tData, function (err, result) {
                                if (err)
                                    return;
                                mDao.dealQr(qrid);
                            });
                        }
                    }
                }
            } else if (message.Event == "subscribe") {   // 用户关注事件
                //todo: 关注后对未发送的模版消息全部处理*临时做法，后续应该完全按带参数二维码处理或者设计消息表*
                let dbQRs = yield mDao.getQr("", message.FromUserName, 0);
                if (dbQRs && dbQRs.rows.length > 0 && dbQRs.rows[0].length > 0) {
                    let qrList = dbQRs.rows[0];
                    for (let item of qrList) {
                        if (item.qr_bus_type == 0) {    // 模版消息
                            let dbUser = yield mDao.getUserByPlatform(0, message.FromUserName);
                            if (dbUser && dbUser.rows.length > 0 && dbUser.rows[0].length > 0) {
                                let uData = dbUser.rows[0][0];
                                var tData = {
                                    "first": {
                                        "value": uData.user_real_name + " 恭喜你加入会员成功！",
                                        "color": "#173177"
                                    },
                                    "keyword1": {
                                        "value": uData.user_mobile,
                                        "color": "#173177"
                                    },
                                    "keyword2": {
                                        "value": uData.user_serial,
                                        "color": "#173177"
                                    },
                                    "keyword3": {
                                        "value": uData.user_create_date,
                                        "color": "#173177"
                                    },
                                    "remark": {
                                        "value": "欢迎您加入大家庭！",
                                        "color": "#173177"
                                    }
                                };
                                wechatapi.sendTemplate(message.FromUserName, "f6BibWiwenO_Pcj9wSU-X4rJakxJZe238V_tsfvkgLY", "http://activity.huanxinkeji.cn/activity.html?cateid=bf2c83ef-e93e-4bcd-b5bb-7ffa031764e8&slider=activity-top",
                                    tData, function (err, result) {
                                        if (err)
                                            return;
                                        mDao.dealQr(item.qr_id);
                                    });
                            }
                        }
                    }
                }
            }
        }
    });
    res.send("success");
}));
module.exports = router;