var co = require('co');
var memberDao = require('../../model/member/member');
var controllerBase = require('../../core/controllerBase');
var uuid = require('node-uuid');
var errEnum = require("../../common/enum");
var validator = require("validator");
var pfMsg = require("../../common/message");
var msgConfig = require("../../message.json");
const util = require('util');
const cache = require("../../core/cache/memorycache");

const editAddress = Symbol("addOrEditAddress");

class MemberController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new memberDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //#获取详细记录的路由配置
        // 入会填写资料获取信息
        this.app.get('/members/:id', function (req, res) {
            co(instance.getDetail(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });

        // 填写会员资料
        this.app.post('/members', function (req, res) {
            co(instance.joinMember(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });

        // 获取入会类型
        this.app.get('/membertype/:id', function (req, res) {
            if (!req.params.id || !validator.isUUID(req.params.id))
                return res.json({ successed: true, message: "参数错误！" });
            instance._daoModel.getMemberType(req.params.id).then(function (result) {
                if (result.rows != null && result.rows.length == 1) {
                    res.json({ successed: true, data: result.rows[0] });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        // 获取用户信息
        this.app.get('/users/:id', function (req, res) {
            let userid = req.params.id;
            if (!userid || !validator.isUUID(userid)) {
                return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            }
            co(function* () {
                let result = yield instance._daoModel.getUserInfo(req.params.id);
                if (result.rows != null && result.rows.length == 1) {
                    return { successed: true, data: result.rows[0] };
                } else {
                    return { successed: false, message: "获取数据出错" };
                }
            }).then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });

        this.app.put("/users", function (req, res) {
            var userlogo = req.body.userlogo || "";
            var mobile = req.body.mobile;
            var username = req.body.username;
            var realname = req.body.realname;
            var sex = req.body.sex;
            var corpname = req.body.corpname;
            var corpposition = req.body.corpposition || "";
            var userid = req.body.userid;
            instance._daoModel.editUser([userlogo, mobile, username, realname, sex, corpname, corpposition, userid])
                .then(function (result) {
                    res.json({ successed: true });
                })
                .catch(function (err) {
                    res.json({ successed: false });
                });
        });

		this.app.get("/ismember", function (req, res) {
            let memberid = req.query.memberid;
            let userid = req.query.userid;
            if (!memberid || !userid || !validator.isUUID(memberid) || !validator.isUUID(userid)) {
                return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            }
            instance._daoModel.isMember(userid, memberid).then(function (result) {
                if (result.rows != null && result.rows.length == 1) {
                    return res.json({ successed: true, ismember: result.rows[0].vip_count});
                } else {
                    return res.json({ successed: false, message: "获取数据失败！" });
                }
            }).catch(function (err) {
                return res.json({ successed: false, message: "获取数据失败！" });
            });
        });
		
        // 获取、创建、更新用户地址
        this.app.route('/users/:id/addresses')
            .get(function (req, res) {
                let userid = req.params.id;
                if (!userid || !validator.isUUID(userid)) {
                    return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
                }
                co(function* () {
                    let result = yield instance._daoModel.getUserAddress(userid);
                    if (result.rows != null) {
                        return { successed: true, data: result.rows };
                    } else {
                        return { successed: false, message: "获取数据出错" };
                    }
                }).then(result => instance.responseResult(req, res, result))
                    .catch(err => instance.responseResult(req, res, err));
            })
            .post(function (req, res) {
                co(instance.editAddress(req)).then(result => instance.responseResult(req, res, result))
                    .catch(err => instance.responseResult(req, res, err));
            })
            .put(function (req, res) {
                co(instance.editAddress(req)).then(result => instance.responseResult(req, res, result))
                    .catch(err => instance.responseResult(req, res, err));
            });


        //获取地址详情、删除地址
        this.app.route("/users/:uid/addresses/:addrid")
            .get(function (req, res) {
                let userid = req.params.uid;
                let addrid = req.params.addrid;
                if (!userid || !addrid || !validator.isUUID(userid) || !validator.isUUID(addrid)) {
                    return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
                }
                instance._daoModel.getAddressDetail(userid, addrid).then(function (result) {
                    res.json({});
                }).catch(function (err) {

                });
            })
            .delete(function (req, res) {
                let userid = req.params.uid;
                let addrid = req.params.addrid;
                if (!userid || !addrid || !validator.isUUID(userid) || !validator.isUUID(addrid)) {
                    return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
                }
                instance._daoModel.deleteUserAddress(userid, addrid).then(function (result) {
                    res.json({ successed: true, message: "删除地址成功！" });
                }).catch(function (err) {
                    res.json({ successed: false, message: "删除地址失败！" });
                });
            });
    }

    //入会填写资料获取信息
    *getDetail(req) {
        let userid = req.params.id;
        let memberid = req.query.memberid;
        if (!userid || !memberid || !validator.isUUID(userid) || !validator.isUUID(memberid))
            return { successed: false, message: "参数错误" };
        let result = yield this._daoModel.getDetail({ userid: userid, memberid: memberid });
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            return { successed: true, data: result.rows[0][0] };
        } else {
            return { successed: false, message: "获取数据出错" };
        }
    }

    //加入会员
    *joinMember(req) {
        var userid = req.body.userid;
        var memberid = req.body.memberid;
        var mobile = req.body.mobile;
        var serialcode = req.body.serialcode;
        var realname = req.body.realname;
        var sex = req.body.sex;
        var corpname = req.body.corpname;
        var corpposition = req.body.corpposition || '';
        var recommend = req.body.recommend || '';
        recommend = recommend.trim();
        if (!userid || !validator.isUUID(userid)) return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        if (!memberid || !validator.isUUID(memberid)) return { successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] };
        if (!mobile || !validator.isMobilePhone(mobile, "zh-CN")) return { successed: false, error: 3002, message: errEnum.RESULT_ERROR_ENUM[3002] };

        if (!realname || !corpname || !serialcode)
            return { successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] };
        // 验证手机号和验证码匹配
        let cacheCode = yield cache.get(mobile);
        if (cacheCode != serialcode)
            return { successed: false, error: 3004, message: errEnum.RESULT_ERROR_ENUM[3004] };
        let userdata = JSON.stringify(req.body);
        let params = [
            userid, memberid, mobile, realname, sex, recommend, corpname, corpposition, userdata
        ]
        let result = yield this._daoModel.joinMember(params);
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            let retValue = result.rows[0][0].result;
            return {
                successed: (retValue == 0 || retValue == 2005),
                error: retValue, message: errEnum.RESULT_ERROR_ENUM[retValue],
                orderid: result.rows[0][0].orderid
            };
        }
        else {
            return { successed: false, error: 3002, message: "加入会员出错" };
        }
    }

    // 添加或编辑地址
    *editAddress(req) {
        let create = false;
        let addrid = req.body.addrid;
        if (!addrid) {
            addrid = uuid.v4();
            create = true;
        } else if (!validator.isUUID(addrid)) {
            return { successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] };
        }
        let userid = req.params.id;
        if (!userid || !validator.isUUID(userid)) {
            return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        }
        let cityid = req.body.cityid;
        let cityname = req.body.cityname;
        if (!cityid || !cityname || !validator.isUUID(cityid)) {
            return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        }
        let districtid = req.body.districtid;
        let districtname = req.body.districtname;
        if (!districtid || !districtname || !validator.isUUID(districtid)) {
            return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        }
        let addrname = req.body.addrname;
        if (!addrname) return { successed: false, error: 5002, message: errEnum.RESULT_ERROR_ENUM[5002] };
        let recipient = req.body.recipient;
        if (!recipient) return { successed: false, error: 5001, message: errEnum.RESULT_ERROR_ENUM[5001] };
        let isdefault = req.body.isdefault || 0;
        let mobile = req.body.mobile;
        if (!mobile || !validator.isMobilePhone(mobile, "zh-CN")) return { successed: false, error: 3002, message: errEnum.RESULT_ERROR_ENUM[3002] };
        let params = [addrid, userid, cityid, cityname, districtid, districtname, addrname, recipient, isdefault, mobile, (create ? 1 : 0)];
        let result = yield this._daoModel.editUserAddress(params);
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            let retValue = result.rows[0][0].result;
            return {
                successed: (retValue == 0),
                error: retValue,
                message: errEnum.RESULT_ERROR_ENUM[retValue],
                addrid: addrid
            };
        }
        else {
            return { successed: false, message: "服务器处理失败！" };
        }
    }

};
exports = module.exports = MemberController;