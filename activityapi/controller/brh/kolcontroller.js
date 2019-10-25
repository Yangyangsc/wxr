var co = require('co');
var brhDao = require('../../model/brh/brhmodel');
var controllerBase = require('../../core/controllerBase');
var validator = require("validator");
var errEnum = require("../../common/enum");
var moment = require("moment");
var uuid = require('node-uuid');
const jwt = require("jwt-simple");
const config = require('../../core/configuration/frameworkConfig');

/**
 * 电子商务
 */
class EcommerceController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new brhDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //获取智库信息
        this.app.get('/brh/kols', function (req, res) {
            instance._daoModel.getKols().then(function (result) {
                if (result.rows != null) {
                    res.json({ successed: true, data: result.rows });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        // 登录
        this.app.post('/brh/login', function (req, res) {
            let account = req.body.account;
            let password = req.body.password;
            if (!account || !password)
                return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            instance._daoModel.login(account, password).then(function (result) {
                if (result.rows != null) {
                    var user = result.rows.length > 0 ? result.rows[0] : null;
                    if (!user) return res.json({ successed: false, message: "帐号或密码错误！" });
                    var expires = moment().add(1, 'days').valueOf();
                    var token = jwt.encode({ iss: user, exp: expires, random: Math.random() }, config.getSetting('TokenCryptKey'));
                    user.token = token;
                    user.exp = expires;
                    res.json({ successed: true, data: result.rows });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        //服务申请
        this.app.post('/brh/services/apply', function (req, res) {
            let serverid = req.body.serviceid;
            let apptype = req.body.apptype;
            let appdataid = req.body.appdataid;
            if (!serverid || !validator.isUUID(serverid)) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            instance._daoModel.applyService(req.user.id, serverid, apptype, appdataid).then(function (result) {
                if (result.rows != null) {
                    let retValue = result.rows[0][0].result;
                    if (retValue != 0) return res.json({ successed: false, error: retValue, message: errEnum.RESULT_ERROR_ENUM[retValue] });
                    res.json({ successed: true });
                } else {
                    res.json({ successed: false, message: "申请服务处理失败" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "申请服务处理失败" });
            });
        });

        //获取个人服务
        this.app.post('/brh/services', function (req, res) {
            instance._daoModel.getMyServices(req.user.id).then(function (result) {
                if (result.rows != null && result.rows.length == 3) {
                    res.json({ successed: true, apply_total: result.rows[0][0].apply_total, data: result.rows[1] });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            })
        });

        //修改密码
        this.app.post('/brh/password', function (req, res) {
            let password = req.body.password;
            let newpassword = req.body.newpassword;
            if (!newpassword || !password)
                return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            instance._daoModel.updatePassword(req.user.id, password, newpassword).then(function (result) {
                if (result.rows != null && result.rows.affectedRows > 0) {
                    res.json({ successed: true, message: "密码修改成功！" });
                } else {
                    res.json({ successed: false, message: "修改失败，请确认旧密码正确" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "修改失败" });
            });
        });
        //获取个人预约记录
        this.app.get('/brh/applys', function (req, res) {
            instance._daoModel.getMyApplys(req.user.id).then(function (result) {
                if (result.rows != null) {
                    res.json({ successed: true, data: result.rows[0] });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });
        //获取媒体库列表
        this.app.get('/brh/medias', function (req, res) {
            let level = req.query.level;
            let page = req.query.page;
            let rows = req.query.rows;
            instance._daoModel.getMedias(level, page, rows).then(function (result) {
                if (result.rows != null) {
                    res.json({ successed: true, data: result.rows[0] });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        this.app.get("/brh/medias/:mediano", function (req, res) {
            let mediano = req.params.mediano;
            if (!mediano) return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            let startdate = req.query.start ? moment(req.query.start).format("YYYYMMDD") : moment().add(-8, "day").format("YYYYMMDD");
            let enddate = req.query.end ? moment(req.query.end).format("YYYYMMDD") : moment().add(-2, "day").format("YYYYMMDD");
            instance._daoModel.getMediaDetail(mediano, startdate, enddate).then(function (result) {
                if (result.rows && result.rows.length == 3) {
                    let data = result.rows[0][0];
                    data.ranks = result.rows[1];
                    return res.json({ successed: true, data: data });
                }
                return res.json({ successed: false, message: "获取数据出错" });
            }).catch(function (err) {
                return res.json({ successed: false, message: "获取数据出错" });
            });
        });
    }
}
exports = module.exports = EcommerceController;