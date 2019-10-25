/*
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var mysql = require('mysql');
var crypto = require('crypto');
var userDao = require('../model/user');
var controllerBase = require('../core/controllerBase');
var config = require('../core/configuration/frameworkConfig');
var utility = require('../core/utilities/utilities');
var apiResult = require('../core/result/actionResult');
class UserController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new userDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //#用户修改密码
         this.app.post('/user/:id/changepassword', function (req, res) {
            co(instance._daoModel.changePassword(req.params.id,req.body.oldpassword,req.body.newpassword))
                .then(result =>{return res.json({successed:result.rows.affectedRows==1,errormessage:result.rows.affectedRows==1?"":"旧密码输入错误"})})
                .catch(result =>instance.responseResult(req,res,{successed:false,errormessage:result.err}))
        });
         //#设置用户的可用状态
         this.app.post('/user/disable/:id', function (req, res) {
            co(instance._daoModel.setUserDisbled(req.params.id,req.body.disable))
                .then(result =>{return res.json({successed:result.rows.affectedRows==1})})
                .catch(result =>instance.responseResult(req,res,{successed:false,errormessage:result.err}))
        });
        //#重置用户的登录密码
         this.app.post('/user/reset/:id', function (req, res) {
            let cryptoMode = config.getSetting("crypto", "md5");
            let hasherPassword = crypto.createHash(cryptoMode)
                                .update(config.getSetting("defaultPassword", "a123456"))
                                .digest('hex');
            co(instance._daoModel.resetUserPassword(req.params.id,hasherPassword))
                .then(result =>{return res.json({successed:result.rows.affectedRows==1})})
                .catch(result =>instance.responseResult(req,res,{successed:false,errormessage:result.err}))
        });
        //#检查用户是否已经存在
        this.app.post('/user/checkaccount',function(req,res){
            co(instance._daoModel.findUserByAccount(req.body.account))
                .then(result=>{
                    ///如果有记录，则表示用户已经存在
                    return res.json({successed:true,existed:result.rows.length>0});
                })
                .catch(result=>res.json(result));
        })
        
         //#获取用户所在的角色列表
        this.app.get('/user/roles/(:id?)', function (req, res) {
            co(instance.getUserRoles(req,req.params.id))
                .then(result =>instance.responseResult(req,res,result))     //.then(result=>res.render("user",result))     ///Or You can output Json 
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })

        });
        ///以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
        ///根据实际情况可以继续添加其他路由，或删除现有路由
        //#处理获取实体列表的路由函数
        this.app.get('/user', function (req, res) {
            co(instance.getListData(req, "user"))
                .then(result => {
                    console.log(result);
                    instance.responseResult(req, res, result);
                })     //.then(result=>res.render("user",result))     ///Or You can output Json 
                .catch(result => { instance.responseResult(req, res, result); })
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/user', function (req, res) {
            co(instance.create(req, "user"))
                .then(result => { instance.responseResult(req, res, result) })
                .catch(result => { instance.responseResult(req, res, result) });
        });
        //#获取详细记录的路由配置
        this.app.get('/user/:id', function (req, res) {
            co(instance.getDataById(req, "user"))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });
        //#处理更新实体记录的路由配置
        this.app.put('/user/:id', function (req, res) {
            co(instance.update(req, "user"))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/user/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { instance.responseResult(req, res, result); });
        });
        //#获取对应用户所拥有的系统菜单
        this.app.get("/user/function/:id", function (req, res) {
            instance.responseResult(req, res, {successed:true,data:req.user.functions})
        });


    }
    *getUserRoles(req,userUid){
        ///如果没有userUid，则取当前登录用户的角色
        userUid=utility.checkValue(userUid,(req.user==null?'':req.user.id));
         ////操作数据库
        let result = yield this._daoModel.getUserRoles(userUid);//req.user.id);
        if (result.rows != null) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let outputData = { "successed": true, rows: result.rows };
            return outputData;
        }
        return { "successed": false };
    }

    beforeAccessDB(req, sql, parameters, type) {
        return new Promise(resolve=>{
            ///如果是新增的用户，注意密码加密
            if (type == "create") {
                let cryptoMode = config.getSetting("crypto", "md5");
                let hasherPassword = crypto.createHash(cryptoMode)
                                    .update(utility.checkValue(parameters.user_password,config.getSetting("defaultPassword", "a123456")))
                                    .digest('hex');
                parameters.user_password = hasherPassword;
            }
            resolve({ sql: sql, sqlParams: parameters });
        });
    }
}

exports = module.exports = UserController;