var co = require('co');
var controllerBase = require('../core/controllerBase');
var uuid = require('node-uuid');
var errEnum = require("../common/enum");
var validator = require("validator");
var pfMsg = require("../common/message");
var msgConfig = require("../message.json");
const common = require("../common/common");
const commonDao = require("../model/common");
const util = require('util');
var svgCaptcha = require('svg-captcha');
const cache = require("../core/cache/memorycache");
const config = require("../configuration.json");
const qrcode = require('qr-image');
const path = require("path");


svgCaptcha.options.charPreset = "0123456789";

class MemberController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new commonDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //#获取详细记录的路由配置
        this.app.post('/sms', function (req, res) {
            let type = req.body.type;
            let mobile = req.body.mobile;
            if (!mobile || !validator.isMobilePhone(mobile, "zh-CN"))
                return res.json({ successed: true, message: "手机号码不正确。" });
            if (type == 1)//发送验证码
            {
                let verifycode = req.body.verifycode;
                let verifykey = req.body.verifykey;
                if (!verifycode || !verifykey)
                    return res.json({ successed: false, message: "请输入图形验证码信息" })
                cache.get(verifykey).then(function (result) {
                    if (result == (verifycode.trim().toUpperCase())) {
                        let code = common.NumSerialCode();
                        let serialcode = util.format(msgConfig.serialcode, code);
                        pfMsg.SMS({ "Mobile": mobile, "Content": serialcode }).then(function (result) {
                            cache.set(mobile, code, 1200000);
                            res.json({ successed: true, message: "验证码已发送，请注意查收。" });
                        }).catch(function (err) {
                            res.json({ successed: false, message: "验证码发送失败，请稍后重试。" });
                        });
                    } else {
                        res.json({ successed: false, message: "图形验证码错误" });
                    }
                }).catch(function (err) {
                    res.json({ successed: false, message: "图形验证码已失效" });
                })
            } else {
                res.json({ successed: false, message: "没有匹配类型" });
            }
        });

        this.app.get('/serial', function (req, res) {
            var captcha = svgCaptcha.create();
            let key = uuid.v4();
            cache.set(key, captcha.text.toUpperCase(), 120000).then(result => {
                res.json({ successed: true, key: key, code: captcha.data });
            }).catch(err => {
                res.json({ successed: false });
            });
        });

        this.app.get("/districts", function (req, res) {
            let parentid = req.query.parentid || '';
            if (parentid && !validator.isUUID(parentid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            instance._daoModel.getDistricts(parentid).then(function (result) {
                if (result.rows != null && result.rows.length == 2) {
                    res.json({ successed: true, data: result.rows[0] });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        this.app.get("/sliders", function (req, res) {
            let sliderkey = req.query.key;
            let platform = req.query.platform;
            instance._daoModel.getSliders(sliderkey, platform).then(function (result) {
                if (result.rows != null) {
                    res.json({ successed: true, rows: result.rows });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        this.app.get("/shareqr/:serial", function (req, res) {
            let url = config.membershareurl;
            let serial = req.params.serial;
            if (!url) {
                res.sendFile(path.join(__dirname, "../public/images/wg_qrcode.jpg"));
            } else {
                url += (url.indexOf("?") < 0 ? "?" : "&") + "shareserial=" + serial;
                let qr_img = qrcode.image(url, { type: 'png', size: 5, margin: 4 });
                qr_img.pipe(res);
            }
        });
    }
}
exports = module.exports = MemberController;