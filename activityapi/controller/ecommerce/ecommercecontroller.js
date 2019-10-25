var co = require('co');
var ecDao = require('../../model/ecommerce/ecommerce');
var controllerBase = require('../../core/controllerBase');
var validator = require("validator");
var errEnum = require("../../common/enum");
var uuid = require('node-uuid');

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
        super(application, new ecDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //获取票据信息（活动简介等）
        this.app.get('/products', function (req, res) {
            instance._daoModel.getProducts().then(function (result) {
                if (result.rows != null && result.rows.length == 2) {
                    res.json({ successed: true, data: result.rows[0] });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            })
        });

        // 获取商品详细
        this.app.get('/products/:pid', function (req, res) {
            let pid = req.params.pid;
            let uid = req.query.uid;
            if (!pid || !uid || !validator.isUUID(pid) || !validator.isUUID(uid))
                return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
            instance._daoModel.getProductDetail({ userid: uid, productid: pid }).then(function (result) {
                if (result.rows != null) {
                    let retValue = result.rows[0][0].result;
                    if (retValue != 0) return res.json({ successed: false, error: retValue, message: errEnum.RESULT_ERROR_ENUM[retValue] });
                    res.json({
                        successed: true,
                        address: result.rows[1].length > 0 ? result.rows[1][0] : null,
                        product: result.rows[2][0]
                    });
                } else {
                    res.json({ successed: false, message: "获取数据出错" });
                }
            }).catch(function (err) {
                res.json({ successed: false, message: "获取数据出错" });
            });
        });

        // 商品订单
        this.app.route('/ec/orders')
            .get(function (req, res) {
                let userid = req.query.userid;
                if (!userid || !validator.isUUID(userid))
                    return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
                instance._daoModel.getOrderList(userid).then(function (result) {
                    if (result.rows != null && result.rows.length == 2) {
                        return res.json({ successed: true, rows: result.rows[0] });
                    } else {
                        return res.json({ successed: false, message: "获取数据失败！" });
                    }
                }).catch(function (err) {
                    res.json({ successed: false, message: "获取数据出错" });
                })
            })
            .post(function (req, res) {
                let userid = req.body.userid;
                let productid = req.body.productid;
                if (!userid || !productid || !validator.isUUID(userid) || !validator.isUUID(productid))
                    return res.json({ successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] });
                let ordercount = req.body.ordercount;
                if (!ordercount || ordercount <= 0)
                    return res.json({ successed: false, error: 6003, message: errEnum.RESULT_ERROR_ENUM[6003] });
                let receiveinfo = req.body.receiveinfo;
                if (!receiveinfo)
                    return res.json({ successed: false, error: 6004, message: errEnum.RESULT_ERROR_ENUM[6004] });
                let orderid = uuid.v4();
                let orderno = orderid.replace(/-/g, "");
                let paytype = 0;
                let params = [userid, orderid, orderno, productid, ordercount, receiveinfo, paytype];
                instance._daoModel.createOrder(params).then(function (result) {
                    if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
                        let retValue = result.rows[0][0].result;
                        if (retValue != 0) {
                            return res.json({ successed: false, error: retValue, message: errEnum.RESULT_ERROR_ENUM[retValue] });
                        }
                        return res.json({
                            successed: true, data: {
                                orderid: orderid, orderno: orderno
                            }
                        });
                    }
                    else {
                        return res.json({ "successed": false, message: "创建订单出错！" });
                    }

                }).catch(function (err) {
                    return res.json({ "successed": false, message: "创建订单出错！" });
                })
            });
    }
    //购票是获取票据和活动相关信息
    *getDetialForOrder(req) {
        let tid = req.params.id;
        if (!validator.isUUID(tid)) return { successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] };
        let channelid = req.query.cid || "";
        let giftid = req.query.gid || "";
        let uid = req.query.uid || "";

        let result = yield this._daoModel.getDetialForOrder([tid, channelid, giftid, uid]);
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            let outputData = { successed: true, rows: result.rows[0] };
            return outputData;
        }
        return { successed: false, message: "数据不存在" };
    }
}
exports = module.exports = EcommerceController;