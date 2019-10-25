/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var functionDao = require('../model/function');
var controllerBase = require('../core/controllerBase');
var utility = require('../core/utilities/utilities');
class FunctionController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new functionDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {

         //#设置用户的可用状态
         this.app.post('/function/disable/:id', function (req, res) {
            co(instance._daoModel.setDisbled(req.params.id,req.body.disable))
                .then(result =>{return res.json({successed:result.rows.affectedRows==1})})
                .catch(result =>instance.responseResult(req,res,{successed:false,errormessage:result.err}))
        });
        ///以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
        ///根据实际情况可以继续添加其他路由，或删除现有路由
        //#处理获取实体列表的路由函数
        this.app.get('/function/:id/privileges', function (req, res) {
            co(instance._daoModel.getFuncPrivileges(req.params.id))
                .then(result =>res.json({successed:true,rows:result.rows,total:result.rows.length}))
                .catch(result => { instance.responseResult(req,res,result); })
        });
        this.app.get('/function', function (req, res) {
            co(instance.getFunctionsTree())
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        //#处理提交菜单新增权限的路由
        this.app.post('/function/:id/addprivileges', function (req, res) {
            co(instance._daoModel.addFunctionPrivilege(req.params.id,req.body.userid,req.body.roleid))
                .then(result =>res.json({successed:true}))
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/function', function (req, res) {
            co(instance.create(req, "function"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#获取详细记录的路由配置
        this.app.get('/function/:id', function (req, res) {
            co(instance.getDataById(req, "function"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        //#处理更新实体记录的路由配置
        this.app.put('/function/:id', function (req, res) {
            co(instance.update(req, "function"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/function/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=>{instance.responseResult(req,res,result);});
        });
        
    }
    ///获取到系统功能菜单树
    *getFunctionsTree() {
        ////操作数据库
        let result = yield this._daoModel.getFunctions();
        if (result.rows != null) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let resultItem=yield utility.hierarchyItems(result.rows, "id", "pid", ["id", "pid", "text", "url","icon","disable","type"],[{id:'',text:'后台管理',pid:null,url:null,icon:null}]);
            let outputData = { "successed":true,data:resultItem};
            return outputData;
        } 
        return { "successed": false};
    }
}
exports = module.exports = FunctionController;