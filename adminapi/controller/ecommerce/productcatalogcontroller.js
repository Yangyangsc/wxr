/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var productCatalogDao = require('../../model/ecommerce/productcatalog');
var controllerBase = require('../../core/controllerBase');
var utility=require('../../core/utilities/utilities');
class ProductCatalogController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new productCatalogDao());
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
        this.app.get('/productcatalog', function (req, res) {
            co(instance.getCatalogTree())
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/productcatalog', function (req, res) {
            co(instance.create(req, "productcatalog"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#获取详细记录的路由配置
        this.app.get('/productcatalog/:id', function (req, res) {
            co(instance.getDataById(req, "productcatalog"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
         //#更换父类id
        this.app.put('/productcatalog/:id/changeparent', function (req, res) {
            co(instance._daoModel.ChangeParentcatalog(req.params.id,req.body.parentid))
                .then(result => res.json({successed:true,id:req.params.id,pid:req.body.parentid}))
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#处理更新实体记录的路由配置
        this.app.put('/productcatalog/:id', function (req, res) {
            co(instance.update(req, "productcatalog"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/productcatalog/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=>{instance.responseResult(req,res,result);});
        });
        
    }
    *getCatalogTree() {
        ////操作数据库
        let result = yield this._daoModel.getCatalogs();
        if (result.rows != null) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let resultItem=yield utility.hierarchyItems(result.rows, "id", "pid", ["id", "pid", "text", "image"],[{id:'',text:'商品分类',pid:null,image:null}]);
            let outputData = { "successed":true,data:resultItem};
            return outputData;
        } 
        return { "successed": false};
    }
}
exports = module.exports = ProductCatalogController;