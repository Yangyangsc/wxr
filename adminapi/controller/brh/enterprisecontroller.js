/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var enterpriseDao = require('../../model/brh/enterprise');
var controllerBase = require('../../core/controllerBase');
var utility =require('../../core/utilities/utilities');
var crypto = require('crypto');
var config = require('../../core/configuration/frameworkConfig');
class EnterpriseController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new enterpriseDao());
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
        this.app.put('/enterprise/:id/disable', function (req, res) {
            var disable=utility.checkValue(req.body.disable,1);
            co(instance._daoModel.setEnterpriseDisabled(req.params.id,disable))
                .then(result =>res.json({successed:true}))
                .catch(result=>res.json(result));
        });

        this.app.post('/enterprise/checkaccount', function (req, res) {
            var accountName=utility.checkValue(req.body.account,'');
            co(instance._daoModel.existAccount(accountName))
                .then(result =>res.json(result))
                .catch(result=>res.json(result));
        });
         //#获取所有企业的预约服务
        this.app.get('/enterprise/appservice', function (req, res) {
           co(instance.getListData(req, "enterpriseappservice"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        //#获取企业的服务券
        this.app.get('/enterprise/:id/service', function (req, res) {
           co(instance._daoModel.getEnterpriseService(req.params.id))
                .then(result =>res.json(result))
                .catch(result=>res.json(result))
        });

         //#增加企业的服务券
        this.app.post('/enterprise/:id/setservicecount', function (req, res) {
           co(instance._daoModel.setServiceCount(req.params.id,req.body.count))
                .then(result =>res.json(result))
                .catch(result=>res.json(result))
        });
       
       this.app.post('/enterprise/:id/resetpassword', function (req, res) {
            let cryptoMode = config.getSetting("crypto", "md5");
            let hasherPassword = crypto.createHash(cryptoMode)
                                .update(config.getSetting("defaultPassword", "123456"))
                                .digest('hex');
            co(instance._daoModel.resetPassword(req.params.id,hasherPassword))
                .then(result =>{return res.json({successed:result.rows.affectedRows==1})})
                .catch(result =>instance.responseResult(req,res,{successed:false,errormessage:result.err}))
        });
        //#获取用户的预约服务
        this.app.get('/enterprise/:id/appservice', function (req, res) {
           co(instance.getListData(req, "enterpriseappservice"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        //#处理获取实体列表的路由函数
        this.app.get('/enterprise', function (req, res) {
            co(instance.getListData(req, "enterprise"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        
         //#处理提交新增实体记录的路由配置
        this.app.post('/enterprise/addservice', function (req, res) {
            co(instance._daoModel.insertService(req.body.serviceData))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/enterprise', function (req, res) {
            co(instance.create(req, "enterprise"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        
        //#获取详细记录的路由配置
        this.app.get('/enterprise/:id', function (req, res) {
            co(instance.getDataById(req, "enterprise"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
         //#批量修改企业的服务券
        this.app.put('/enterprise/batchupdateservice', function (req, res) {
           co(instance._daoModel.batchUpdateService(req.body.updateData))
                .then(result =>res.json(result))
                .catch(result=>res.json(result))
        });
        //#处理更新实体记录的路由配置
        this.app.put('/enterprise/:id', function (req, res) {
            co(instance.update(req, "enterprise"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/enterprise/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => res.json(result))
                .catch(result =>  res.json(result));
        });
        //#删除企业的服务
        this.app.delete('/enterprise/service/:id', function (req, res) {
            co(instance._daoModel.deleteService(req.params.id))
                .then(result => res.json(result))
                .catch(result =>  res.json(result));
        });
    }
    beforeAccessDB(req, sql, parameters, type) {
        return new Promise(resolve=>{
            ///如果是新增的用户，注意密码加密
            if (type == "create") {
                let cryptoMode = config.getSetting("crypto", "md5");
                let hasherPassword = crypto.createHash(cryptoMode)
                                    .update(utility.checkValue(parameters.enterprise_password,config.getSetting("defaultPassword", "123456")))
                                    .digest('hex');
                parameters.enterprise_password = hasherPassword;
            }
            resolve({ sql: sql, sqlParams: parameters });
        });
    }
}
exports = module.exports = EnterpriseController;