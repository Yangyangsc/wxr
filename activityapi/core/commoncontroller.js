/*
* 通用的数据列表获取器，用于提供前端通用的选择数据接口
*/
var co = require('co');
var commonDao = require('../core/database/daoBase');
var controllerBase = require('./controllerBase');
var utility = require('../core/utilities/utilities');
class CommonDataController extends controllerBase {
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new commonDao());
    }
   
    initializeRouter(instance) {
        ///以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
        ///根据实际情况可以继续添加其他路由，或删除现有路由
        //#处理获取实体列表的路由函数
        ///处理多层级的
        this.app.get('/common/hierarchy/:type', function (req, res) {
            co(instance.getDepartmentTree())
                .then(result =>instance.responseResult(req,res,result))
                .catch(result=>instance.responseResult(req,res,result))
        });
        //#处理获取实体列表的路由函数
        this.app.get('/common/:type', function (req, res) {
            co(instance.getListData(req,req.params.type,1))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result=>instance.responseResult(req,res,result))
        });

        
    }

    *getDepartmentTree() {
        var daoDepartment = require('../model/department');
        ////操作数据库
        let result = yield new daoDepartment().getDepartments();
        if (result.rows != null) {
            ///将从数据库中获得的结果集根据dataconfig中的配置进行映射转换
            let resultItem=yield utility.hierarchyItems(result.rows, "id", "pid", ["id", "pid", "text", "code"],[{id:'',text:'广州市轻码科技有限公司',pid:null,code:'LC'}]);
            let outputData = { "successed":true,data:resultItem};
            return outputData;
        } 
        return { "successed": false};
    }
}
exports = module.exports = CommonDataController;