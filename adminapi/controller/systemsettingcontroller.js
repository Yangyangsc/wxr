/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var settingDao = require('../model/systemsetting');
var controllerBase = require('../core/controllerBase');
class SystemSettingController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new settingDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //#获取详细记录的路由配置
        this.app.get('/SystemSetting/:id', function (req, res) {
            co(instance.getDataById(req,"systemsetting"))
                .then(result =>res.json(result))
                .catch(result =>res.json(result));
        });
        //#处理更新实体记录的路由配置
        this.app.put('/SystemSetting/:id', function (req, res) {
            co(instance.update(req, "systemsetting"))
                .then(result =>res.json(result))
                .catch(result=> res.json(result));
        });
        
        
    }

    beforeAccessDB(req, sql, parameters, type) {
        ///如果是新增的用户，注意密码加密
        if (type == "update") {
            console.log(req.body);
            parameters.setting_json =JSON.stringify(req.body);
            console.log(parameters);
        }
        return { sql: sql, sqlParams: parameters };
    }
}
exports = module.exports = SystemSettingController;