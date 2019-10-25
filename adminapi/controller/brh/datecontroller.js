/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var dateDao = require('../../model/brh/serviceapplication');
var controllerBase = require('../../core/controllerBase');
var utility =require('../../core/utilities/utilities');
class DateController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new dateDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        ///以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
        ///根据实际情况可以继续添加其他路由，或删除现有路由
        //#处理删除实体记录的路由配置
       
        
        //#处理提交新增实体记录的路由配置
        this.app.post('/date', function (req, res) {
            co(instance.create(req, "date"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        
        //#处理提交新增实体记录的路由配置
        this.app.post('/date/:id/process', function (req, res) {
            co(instance._daoModel.processDate(req.params.id,req.body.status,req.body.memo))
                .then(result => { res.json(result);})
                .catch(result =>{ res.json(result); });
        });
    }
}
exports = module.exports = DateController;