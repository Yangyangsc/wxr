/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var kolDao = require('../../model/brh/kol');
var controllerBase = require('../../core/controllerBase');
var utility =require('../../core/utilities/utilities');
class KOLController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new kolDao());
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
        this.app.put('/kol/:id/disable', function (req, res) {
            var disable=utility.checkValue(req.body.disable,1);
            co(instance._daoModel.setEnterpriseDisabled(req.params.id,disable))
                .then(result =>res.json({successed:true}))
                .catch(result=>res.json(result));
        });
        //#处理获取实体列表的路由函数
        this.app.get('/kol', function (req, res) {
            co(instance.getListData(req, "kol"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        
        //#处理提交新增实体记录的路由配置
        this.app.post('/kol', function (req, res) {
            co(instance.create(req, "kol"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        
        //#获取详细记录的路由配置
        this.app.get('/kol/:id', function (req, res) {
            co(instance.getDataById(req, "kol"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });

        //#处理更新实体记录的路由配置
        this.app.put('/kol/:id', function (req, res) {
            co(instance.update(req, "kol"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/kol/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => res.json(result))
                .catch(result =>  res.json(result));
        });
    }
}
exports = module.exports = KOLController;