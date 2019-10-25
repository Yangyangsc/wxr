/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var activityticketDao = require('../../model/act/ticket');
var controllerBase = require('../../core/controllerBase');
var validator = require("validator");
var errEnum = require("../../common/enum");

class TicketController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new activityticketDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //获取票据信息（活动简介等）
        this.app.get('/tickets/:id', function (req, res) {
            co(instance.getDetialForOrder(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });
    }
    //购票是获取票据和活动相关信息
    *getDetialForOrder(req) {
        let tid = req.params.id;
        if (!validator.isUUID(tid)) return { successed: false, error: 3001, message: errEnum.RESULT_ERROR_ENUM[3001] };
        let channelid = req.query.cid || "";
        let giftid = req.query.gid || "";
        let openid = req.query.uid || "";
        let userid = req.query.userid || "";

        let result = yield this._daoModel.getDetialForOrder([tid, channelid, giftid, openid, userid]);
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            let outputData = { successed: true, rows: result.rows[0] };
            return outputData;
        }
        return { successed: false, message: "数据不存在" };
    }
}
exports = module.exports = TicketController;