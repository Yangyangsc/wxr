/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var activityDao = require('../../model/crm/activity');
var controllerBase = require('../../core/controllerBase');
var oss = require("../../core/utilities/aLiYunOSSUtility.js");
var richtextDao = require('../../model/bas/richtext');
var dataBusiness = require('../../model/dataBusiness');
class CRMActivityController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new activityDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        ///以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
        ///根据实际情况可以继续添加其他路由，或删除现有路由
        //#处理获取实体列表的路由函数
        this.app.get('/crmactivity/:id/orders', function (req, res) {
            co(instance.getListData(req, "crmactivityorders"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result =>res.json(result))
        });
        this.app.get('/crmactivity', function (req, res) {
            co(instance.getListData(req, "memberactivity"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/crmactivity', function (req, res) {
            co(instance.create(req, "memberactivity"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
       
        //#获取详细记录的路由配置
        this.app.get('/crmactivity/:id', function (req, res) {
            co(instance.getDataById(req, "memberactivity"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        //#发布活动
        this.app.put('/crmactivity/:id/publish', function (req, res) {
            co(instance._daoModel.publishActivity(req.params.id))
                .then(result => res.json(result))
                .catch(result=> res.json(result));
        });
        //#处理更新实体记录的路由配置
        this.app.put('/crmactivity/:id', function (req, res) {
            co(instance.update(req, "activity",req.params.id))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });

        //#处理删除实体记录的路由配置
        this.app.delete('/crmactivity/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=>{instance.responseResult(req,res,result);});
        });
        
    }
      beforeAccessDB(req, sql, sqlParams, type) {
        return co(function*(){
            var richDao = new richtextDao();
            switch(type) {
                case "create":
                    var result = yield richDao.create(dataBusiness.Avtivity,sqlParams[req.primary],req.body.richtext);
                    if (result.successed) return { sql: sql, sqlParams: sqlParams };
                    return {canceled:true};
                case "update":
                    var result = yield  richDao.update(dataBusiness.Avtivity,req.params.id,req.body.richtext);
                    if (result.successed) return { sql: sql, sqlParams: sqlParams };
                    return {canceled:true};
            }
            return { sql: sql, sqlParams: sqlParams }
        });
    }
}
exports = module.exports = CRMActivityController;