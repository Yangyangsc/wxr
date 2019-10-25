/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var homeDao = require('../model/home');
var controllerBase = require('../core/controllerBase');
class HomeController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new homeDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //#获取用户所在的角色列表
        this.app.post('/home/statistics', function (req, res) {
            co(function* () {
                let endDate = new Date();
                let startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);

                let result = yield instance._daoModel.getSysStatistics({ startDate, endDate });
                if (result.successed) {
                    return {
                        successed: true, usercount: result.rows[0][0],
                        usergrow: result.rows[1],
                        userdistribution: result.rows[2],
                        sexdistribution: result.rows[3]
                    };
                }
                return { successed: false, message: "获取数据失败" };
            })
                .then(result => res.json(result))
                .catch(result => { console.log(result); instance.responseResult(req, res, result); })

        });
    }
}
exports = module.exports = HomeController;