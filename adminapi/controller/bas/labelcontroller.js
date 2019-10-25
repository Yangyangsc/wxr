/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var labelDao = require('../../model/bas/label');
var controllerBase = require('../../core/controllerBase');
var utility = require('../../core/utilities/utilities');
var uuid = require('node-uuid');
class LabelController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new labelDao());
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
        // this.app.get('/department', function (req, res) {
        //     co(instance.getListData(req, "department"))
        //         .then(result =>instance.responseResult(req,res,result))
        //         .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        // });
        ///获得顶级分类
         this.app.get('/label/catalog', function (req, res) {
            co(instance._daoModel.getlablesCatalog())
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
         this.app.get('/label/tree', function (req, res) {
            co(instance.getLabelTree())
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
        this.app.get('/label', function (req, res) {
            co(instance.getListData(req, "label"))
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/label', function (req, res) {
            co(instance.create(req, "label"))
                .then(result => res.json(result))
                .catch(result =>res.json(result));
        });
       
        //#获取详细记录的路由配置
        this.app.get('/label/:id', function (req, res) {
            co(instance.getDataById(req, "label"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        //#处理更新实体记录的路由配置
        this.app.put('/label/:id', function (req, res) {
            co(instance.update(req, "label"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/label/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result =>res.json(result))
                .catch(result=>res.json(result));
        });
        
    }

    *getLabelTree() {
        ////操作数据库
        let result = yield this._daoModel.getAllLables();
        if (result.rows != null) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let resultItem=yield utility.hierarchyItems(result.rows, "id", "pid", ["id", "pid", "text"],[{id:'',text:'标签树',pid:null}]);
            let outputData = { "successed":true,data:resultItem};
            return outputData;
        } 
        return { "successed": false};
    }
}
exports = module.exports = LabelController;