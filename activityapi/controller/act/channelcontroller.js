/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var channelDao = require('../../model/act/channel');
var controllerBase = require('../../core/controllerBase');
class TicketController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new channelDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //获取票据信息（活动简介等）
        this.app.get('/channels/:code', function (req, res) {
            console.log("/channels/:code");
            co(instance.getDiscountById(req.params.code))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });
    }

    *getDiscountById(code) {
        console.log("getDiscountById");
        let result = yield this._daoModel.getDiscountById(code);
        if (result.rows != null) {
            let outputData = { "successed": true, rows: result.rows };
            return outputData;
        }
        return { "successed": false };
    }
}
exports = module.exports = TicketController;