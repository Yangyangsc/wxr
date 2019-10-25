var fs = require("fs");
var path = require("path");
var express = require('express');
var router = express.Router();
var config = require('../configuration.json');
var OAuth = require('wechat-oauth');
var wechatResult = require('../common/wechatResult');
var uuid = require('node-uuid');
var errEnum = require("../common/enum");
var validator = require("validator");
var qrcode = require('qr-image');
var fileBase = require("../core/utilities/fileBase");
var config = require('../configuration.json');
var Wechat = new require("wechat-api");
var common = require("../common/common");
const util = require('util');
// const cache = require('memory-cache');
const pfMsg = require("../common/message");
const msgConfig = require("../message.json");
const urlUtil = require('url');
const uploadConfig = require('../uploadconfig.json');
const fileUtility = require("../core/utilities/fileUtility");
const orderModel = require("../model/act/order");
const memberModel = require("../model/member/member");
const ecModel = require("../model/ecommerce/ecommerce");
const moment = require('moment');
const co = require('co');


const qrcodeUtility = require("../core/utilities/qrcodeUtility");
const defaultPath = "public" + path.sep + "qrcode" + path.sep;

var wechatapi = new Wechat(config.weChat.appID, config.weChat.appSecret);

var client = new OAuth(config.weChat.appID, config.weChat.appSecret/*, function (openid, callback) {
    //toto  获取openid对应缓存的token
    callback(null, cache.get(openid));
}, function (openid, token, callback) {
    //todo  缓存openid的token
    cache.put(openid, token, 7200000);
    callback(null);
}*/);

router.get("/wechat/oauth", function (req, res) {
    let oauthCb = config.weChat.oathCallBack;
    let frontUrl = req.query.url;
    if (!frontUrl || !oauthCb) {
        return res.json(wechatResult.URL_LOSE)
    }
    let scope = "snsapi_base";
    if (req.query.scope == 1)
        scope = "snsapi_userinfo";
    let qparams = Object.keys(req.query);
    if (qparams.length > 1) {
        frontUrl += frontUrl.indexOf("?") < 0 ? "?" : "&";
        qparams.forEach(function (key) {
            if (key == "url") return;
            frontUrl += key + "=" + req.query[key] + '&';
        });
        if (frontUrl.endsWith('&'))
            frontUrl = frontUrl.substr(0, frontUrl.length - 1);
    }
    oauthCb += "?url=" + encodeURIComponent(frontUrl);
    let oauthUrl = client.getAuthorizeURL(oauthCb, 'STATE', scope);
    res.redirect(oauthUrl);
});

router.get("/wechat/oauth/callback", function (req, res) {
    let code = req.query.code;
    let url = req.query.url;
    if (!code || !url) return res.json({ successed: false, message: "参数错误！" });
    url = decodeURIComponent(req.query.url);
    url += url.indexOf("?") < 0 ? "?" : "&";
    // console.info("code :///   " + code + "   ////:" + url);
    let urlInfo = urlUtil.parse(url, true);
    if (urlInfo.query.scope == 1) {
        client.getUserByCode({ code: code, lang: "zh_CN" }, function (err, result) {
            console.info("getUserByCode: " + JSON.stringify(result));
            if (err) {
                console.info("getAccessToken error：" + JSON.stringify(err));
                res.redirect(url + "successed=0");
                return;
            }
            let dal = new memberModel();
            let userSex = result.sex == 2 ? 0 : 1;
            // userid: uuid.v4(), username: result.nickname, userimg: "\\app\\userheader\\" + moment().format('YYYYMMDD') + "\\" + (result.unionid ? result.unionid : result.openid) + ".png",
            let params = {
                userid: uuid.v4(), username: result.nickname, userimg: "\\app\\userheader\\head.png",
                usercity: result.city, usersex: userSex, thirdid: uuid.v4(),
                platformtype: 0, platformuserid: result.unionid ? result.unionid : result.openid,
                platformdata: JSON.stringify(result),
                platformuserext: result.openid
            };
            dal.create(params).then(function (dbresult) {
                if (dbresult.rows != null && dbresult.rows.length == 2 && dbresult.rows[0].length > 0) {
                    let retValue = dbresult.rows[0][0].result;
                    let userid = dbresult.rows[0][0].userid;
                    let serial = dbresult.rows[0][0].userserial;
                    if ((retValue == 0 || retValue == 2008) && result.headimgurl) {
                        fileUtility.save2localForRemoteImage(result.headimgurl, params.userimg);
                    }
                    res.redirect(url + "successed=1&userid=" + userid + "&serial=" + serial + "&rnd=" + new Date().getTime());
                }
            }).catch(function (err) {
                console.info("memberModel create error：" + JSON.stringify(err));
                res.redirect(url + "successed=0");
                return;
            });
        });
    } else {
        client.getAccessToken(code, function (err, result) {
            if (err) {
                console.info("getAccessToken error：" + JSON.stringify(err));
                res.redirect(url + "successed=0");
                return;
            }
            /*checkuser=1 用户无感知授权后检查该用户是否存在数据库，如果不存在可以再进入用户确认授权  */
            if (urlInfo.query.checkuser == 1) {
                let dal = new memberModel();
                dal.getUserByPlatform(0, result.data.openid).then(function (dbresult) {
                    
                    if (dbresult.rows != null && dbresult.rows.length == 2 && dbresult.rows[0].length > 0) {
                        res.redirect(url + "successed=1&token=" + result.data.openid +
                            "&haduser=1&userid=" + dbresult.rows[0][0].user_id +
                            "&rnd=" + new Date().getTime());
                    } else {
                        res.redirect(url + "successed=1&token=" + result.data.openid +
                            "&haduser=0&rnd=" + new Date().getTime());
                    }
                }).catch(function (err) {
                    res.redirect(url + "successed=1&token=" + result.data.openid +
                        "&haduser=0&rnd=" + new Date().getTime());
                });
            } else {
                res.redirect(url + "successed=1&token=" + result.data.openid + "&rnd=" + new Date().getTime());
            }
        })
    }


});


var weChatPay = require('wechat-pay');
var paymentConfig = {
    appId: config.weChat.appID,
    mchId: config.weChat.merchantID,
    partnerKey: config.weChat.merchantKey,
    notifyUrl: config.weChat.mpPayCallBack,
    pfx: fs.readFileSync("cert/apiclient_cert.p12")
};
var payment = new weChatPay.Payment(paymentConfig);
var middleware = new weChatPay.middleware(paymentConfig);

router.post("/wechat/mp/pay", function (req, res) {
    let bustype = req.body.bustype || 0;        // 0:购票订单  1：加入会员   2：购买商品
    let ptype = req.body.type || 0;
    let product = errEnum.PAYMENT_BUSINESS_ENUM[ptype];
    let createIp = common.GetIp(req);
    // 门票支付
    if (bustype == 0) {
        let orderid = req.body.orderid;
        if (!validator.isUUID(orderid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
        co(function* () {
            let userid = req.body.userid;
            let openid = req.body.uid;
            if (userid && !openid) {
                let mDal = new memberModel();
                let odata = yield mDal.getOpenidByUser(userid);
                if (odata.rows)
                    openid = odata.rows[0].openid;
            }
            if (!openid) return res.json({ successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] });
            let dal = new orderModel();
            let opResult = yield dal.getOrderPrice(orderid);
            if (opResult.rows != null && opResult.rows.length == 2) {
                let pdata = opResult.rows[0][0];
                if (pdata.result != 0) {
                    return res.json({ successed: false, error: pdata.result, message: errEnum.RESULT_ERROR_ENUM[pdata.result] });
                } else if (pdata.amount < 0) {
                    return res.json({ successed: false, error: 1011, message: errEnum.RESULT_ERROR_ENUM[1011] });
                } else if (pdata.amount == 0) {
                    //修改状态
                    qrcodeUtility.saveQRImg(orderid, orderid + ".png").then((imgpath) => {
                        let dal = new orderModel();
                        dal.finishOrder([orderid, null, imgpath]).then(function (msg) {
                            if (msg.rows != null && msg.rows.length == 2) {
                                let pdata = msg.rows[0][0];
                                let smsTxt = pdata.actsms; // ? pdata.actsms : msgConfig.buysuccess;
                                console.info('免費 ：');
                                console.info(pdata);
                                if (smsTxt) {
                                    let buysuccess = util.format(smsTxt, pdata.username);
                                    pfMsg.SMS({
                                        "Mobile": pdata.usermobile,
                                        "Content": buysuccess
                                    }).then(function (msgResult) {
                                        console.info("发送短信成功 Mobile:  " + pdata.usermobile + "  Content:  " + buysuccess);
                                    }).catch(function (err) {
                                        console.info("发送短信成功 Mobile:  " + pdata.usermobile + "  Content:  " + buysuccess + " errorMsg:  " + err.message);
                                    });
                                }
                                return res.json({message: "支付成功", successed: true, amount: 0});//免费
                            } else {
                                return res.json({message: "支付成功", successed: true, amount: 0});//免费
                                // return res.json({message: "修改状态失败", successed: false});
                            }
                        }).catch(function (err) {
                            return res.json({message: "支付成功", successed: true, amount: 0});//免费
                            // return res.json({message: "修改状态失败", successed: false});
                        });
                    }).catch((err) => {
                        return res.json({message: "支付成功", successed: true, amount: 0});//免费
                        // return res.json({message: "创建二维码失败", successed: false});
                    });
                } else {
                    let order = {
                        body: product,
                        attach: JSON.stringify({ orderid: orderid, bustype: 0 }),
                        out_trade_no: orderid.replace(/-/g, ""),
                        total_fee: parseInt(pdata.amount * 100),
                        spbill_create_ip: createIp,
                        openid: openid,
                        trade_type: 'JSAPI'
                    };
                    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                        if (err) {
                            console.info("微信下单出错：" + err.message + "  order data: " + JSON.stringify(order));
                            return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
                        }
                        res.json({ message: "", successed: true, result: payargs ,amount: pdata.amount });
                    });
                }
            } else {
                console.info("支付获取订单金额出错！result：" + JSON.stringify(result));
                return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
            }
        }).catch(function (err) {
            console.info("支付获取订单金额出错！ err：" + JSON.stringify(result));
            return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
        });
    } else if (bustype == 1) {   //会员支付
        let userid = req.body.userid;
        if (!userid || !validator.isUUID(userid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
        let orderid = req.body.orderid;
        if (!orderid || !validator.isUUID(orderid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });

        let dal = new memberModel();
        dal.getMemberPrice({ userid: userid, orderid: orderid, platformtype: 0 }).then(function (result) {
            if (result.rows != null && result.rows.length == 2) {
                let pdata = result.rows[0][0];
                if (pdata.result != 0) {
                    return res.json({ successed: false, error: pdata.result, message: errEnum.RESULT_ERROR_ENUM[pdata.result] });
                } else if (pdata.amount <= 0) {
                    return res.json({ successed: false, error: 1011, message: errEnum.RESULT_ERROR_ENUM[1011] });
                } else {
                    let order = {
                        body: product,
                        attach: JSON.stringify({ orderid: orderid, bustype: 1 }),
                        out_trade_no: orderid.replace(/-/g, ""),
                        total_fee: parseInt(pdata.amount * 100),
                        spbill_create_ip: createIp,
                        openid: pdata.userextend,
                        trade_type: 'JSAPI'
                    };
                    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                        if (err) {
                            console.info("微信下单出错：" + err.message + "  order data: " + JSON.stringify(order));
                            return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
                        }
                        res.json({ message: "", successed: true, result: payargs });
                    });
                }
            } else {
                return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
            }
        }).catch(function (err) {
            return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
        });

    } else if (bustype == 2) {  // 购买商品
        let userid = req.body.userid;
        if (!userid || !validator.isUUID(userid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
        let orderid = req.body.orderid;
        if (!orderid || !validator.isUUID(orderid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });

        let dal = new ecModel();
        dal.getOrderPrice({ userid: userid, orderid: orderid }).then(function (result) {
            if (result.rows != null && result.rows.length == 2) {
                let pdata = result.rows[0][0];
                if (pdata.result != 0) {
                    return res.json({ successed: false, error: pdata.result, message: errEnum.RESULT_ERROR_ENUM[pdata.result] });
                } else if (pdata.amount <= 0) {
                    return res.json({ successed: false, error: 1011, message: errEnum.RESULT_ERROR_ENUM[1011] });
                } else {
                    let order = {
                        body: product + pdata.extend,
                        attach: JSON.stringify({ orderid: orderid, bustype: 2 }),
                        out_trade_no: orderid.replace(/-/g, ""),
                        total_fee: parseInt(pdata.amount * 100),
                        spbill_create_ip: createIp,
                        openid: pdata.openid,
                        trade_type: 'JSAPI'
                    };
                    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
                        if (err) {
                            console.info("微信下单出错：" + err.message + "  order data: " + JSON.stringify(order));
                            return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
                        }
                        res.json({ message: "", successed: true, result: payargs });
                    });
                }
            } else {
                return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
            }
        }).catch(function (err) {
            return res.json({ successed: false, message: "服务器繁忙请稍后重试！" });
        });
    }
});

router.post("/wechat/mp/pay/callback", middleware.getNotify().done(function (message, req, res, next) {
    console.info("回调成功：" + JSON.stringify(message));
    if (!message.out_trade_no || !message.openid) return res.reply(new Error('回传参数异常！'));
    var attach = {};
    try {
        attach = JSON.parse(message.attach);
        console.info(attach)
    } catch (e) {
        return res.reply(new Error('回传参数异常！'));
    }
    if (attach.bustype == 0) {              // 门票支付回调
        qrcodeUtility.saveQRImg(attach.orderid, attach.orderid + ".png").then((imgpath) => {
            let dal = new orderModel();
            dal.finishOrder([attach.orderid, message.transaction_id, imgpath]).then(function (result) {
                if (result.rows != null && result.rows.length == 2) {
                    let pdata = result.rows[0][0];
                    if (pdata.result == 0) {
                        let smsTxt = pdata.actsms; // ? pdata.actsms : msgConfig.buysuccess;
                        if (smsTxt) {
                            let buysuccess = util.format(smsTxt, pdata.username);
                            pfMsg.SMS({ "Mobile": pdata.usermobile, "Content": buysuccess }).then(function (msgResult) {
                                console.info("发送短信成功 Mobile:  " + pdata.usermobile + "  Content:  " + buysuccess);
                            }).catch(function (err) {
                                console.info("发送短信成功 Mobile:  " + pdata.usermobile + "  Content:  " + buysuccess + " errorMsg:  " + err.message);
                            });
                        }
                        return res.reply('success');
                    }
                    // else if (pdata.result == 1012) {
                    //     res.reply('success');
                    // }
                    else {
                        res.reply('success');
                    }
                } else {
                    return res.reply(new Error('更新状态错误！'));
                }
            }).catch(function (err) {
                return res.reply(new Error('更新状态错误！'))
            });
        }).catch((err) => {
            return res.reply(new Error('处理错误！'));
        });
    } else if (attach.bustype == 1) {       //入会支付回调
        let dal = new memberModel();
        dal.finishOrder([attach.orderid, errEnum.PAYMENT_TYPE.WECHAT_PAY, message.transaction_id]).then(function (result) {
            if (result.rows != null && result.rows.length == 2) {
                let pdata = result.rows[0][0];
                if (pdata.result == 0) {
                    let membersuccess = msgConfig.membersuccess;
                    pfMsg.SMS({ "Mobile": pdata.mobile, "Content": membersuccess }).then(function (msgResult) {
                        console.info("发送短信成功 Mobile:  " + pdata.mobile + "  Content:  " + membersuccess);
                    }).catch(function (err) {
                        console.info("发送短信失败 Mobile:  " + pdata.mobile + "  Content:  " + membersuccess + " errorMsg:  " + err.message);
                    });

                    // todo: 目前直接在订单成功后发送模版消息，后面需要修改为插入消息表由服务执行
                    dal.getUserByPlatform(0, message.openid).then(function (dbUser) {
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
                            wechatapi.sendTemplate(message.openid, "f6BibWiwenO_Pcj9wSU-X4rJakxJZe238V_tsfvkgLY", "http://activity.huanxinkeji.cn/activity.html?cateid=bf2c83ef-e93e-4bcd-b5bb-7ffa031764e8&slider=activity-top", tData, function (err, result) {
                                if (err)
                                    dal.createQR({ qrtype: 0, bustype: 0, busid: "", userid: uData.user_id, expseconds: 0 });
                            });
                        }
                    });



                    let ticketGiftEnd = new Date(config.membergift.giftend);
                    // 加入会员赠送门票
                    if (new Date() < ticketGiftEnd) {
                        let orderid = uuid.v4();
                        let orderno = orderid.replace(/-/g, "");
                        let odal = new orderModel();
                        co(function* () {
                            let orderResult = yield odal.createOrder([
                                orderid, orderno, message.openid, "", 0, uuid.v4(), "", pdata.username, pdata.mobile,
                                pdata.company, pdata.position,
                                config.membergift.ticketid, 1, '', config.membergift.giftid, 0
                            ]);
                            if (orderResult.rows != null && orderResult.rows.length == 2 && orderResult.rows[0].length > 0) {
                                if (orderResult.rows[0][0].result == 1018) {
                                    let imgpath = yield qrcodeUtility.saveQRImg(orderid, orderid + '.png');
                                    let savePath = yield odal.finishOrder([orderno, message.openid, '', 1, imgpath]);
                                }
                            }
                        }).then(function (result) {
                            console.info("入会成功 openid:  " + message.openid + " username: " + pdata.username);
                        }).catch(function (err) {
                            console.info("入会失败 errorMsg:  " + err.message);
                        });
                    }
                    return res.reply('success');
                }
                else {
                    res.reply('success');
                }
            } else {
                return res.reply(new Error('更新状态错误！'));
            }
        }).catch(function (err) {
            return res.reply(new Error('更新状态错误！'))
        });
    } else if (attach.bustype == 2) {       // 购买商品回调
        let dal = new ecModel();
        dal.finishOrder([attach.orderid, message.transaction_id]).then(function (result) {
            if (result.rows != null && result.rows.length == 2) {
                let pdata = result.rows[0][0];
                if (pdata.result == 0) {
                    return res.reply('success');
                }
                else {
                    // todo: 记录错误信息
                    res.reply('success');
                }
            } else {
                return res.reply(new Error('更新状态错误！'));
            }
        }).catch(function (err) {
            return res.reply(new Error('更新状态错误！'))
        });
    }
    else {
        return res.reply(new Error('回传参数异常！'));
    }
}));

router.get("/wechat/jsconfig", function (req, res) {
    let aouthUrl = req.query.url || (req.protocol + "://" + req.host + req.url);
    var params = {
        // debug: false,
        // jsApiList: ['scanQRCode'],
        url: aouthUrl
    };
    wechatapi.getJsConfig(params, function (err, result) {
        if (err) return res.json({ successed: false, message: "获取权限失败！" });
        wechatapi.getTicket('jsapi', function (err, tresult) {
            if (err) return res.json({ successed: false, message: "获取权限失败！" });
            result.ticket = tresult.ticket;
            result.successed = true;
            result.url = aouthUrl;
            res.json(result);
        })
        // result.successed = true;
        // res.json(result);
    });
});

// 获取带参数二维码
router.get("/wechat/qrcode/:type", function (req, res) {
    let type = req.params.type.toLocaleLowerCase();
    let busid = req.query.busid || "";
    // 创建临时二维码
    if (type == "temp") {
        let expireSeconds = req.query.exp || 1800;
        let bustype = req.query.bustype || 0;
        let userid = req.query.userid || "";
        let mDao = new memberModel();
        co(function* () {
            let qrResult = yield mDao.createQR({ qrtype: 0, bustype: bustype, busid: busid, userid: userid, expseconds: expireSeconds });
            if (qrResult && qrResult.rows.length == 2) {
                let qrid = qrResult.rows[0][0].qrid;
                wechatapi.createTmpQRCode(qrid, expireSeconds, function (err, result) {
                    if (err)
                        return res.json({ successed: false, message: "获取二维码出错！" });
                    mDao.updateQr({ ticket: result.ticket, retdata: JSON.stringify(result), qrid: qrid }).catch(function (err) {
                        var hehe = err;
                    });
                    res.json({ successed: true, qrid: qrid, qrcode: "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + encodeURIComponent(result.ticket) });
                });
            }
        }).catch(function (err) {
            res.json({ successed: false, message: "服务器繁忙，请稍后重试！" });
        });
    }
    // 创建永久二维码，有上限控制10万个
    else if (type == "limit") {
        let bustype = req.query.bustype || 0;
        let userid = req.query.userid || "";
        co(function* () {
            let qrResult = yield mDao.createQR({ qrtype: 1, bustype: bustype, busid: busid, userid: userid });
            if (qrResult && qrResult.rows.length == 2) {
                let qrid = qrResult.rows[0][0].qrid;
                wechatapi.createLimitQRCode(qrid, function (err, result) {
                    if (err)
                        return res.json({ successed: false, message: "获取二维码出错！" });
                    mDao.updateQr({ ticket: result.ticket, retdata: JSON.stringify(result), qrid: qrid }).catch(function (err) {
                        var hehe = err;
                    });
                    res.json({ successed: true, qrid: qrid, qrcode: "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + encodeURIComponent(result.ticket) });
                });
            }
        }).catch(function (err) {
            res.json({ successed: false, message: "服务器繁忙，请稍后重试！" });
        });
    } else {
        res.json({ successed: false, message: "二维码创建类型有错！" });
    }
});

router.get("/wechat/test", function (req, res) {

    res.json({ hehe: config.membergift.ticketid + "/////////////////////" + config.membergift.giftid });
});
module.exports = router;