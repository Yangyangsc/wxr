﻿/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var activityOrderDao = require('../../model/act/activityorder');
var controllerBase = require('../../core/controllerBase');
class ActivityOrderController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new activityOrderDao());
    }
    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        ///以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
        ///根据实际情况可以继续添加其他路由，或删除现有路由
        //#处理扫码后的票务信息
        this.app.get('/activityorder/:id', function (req, res) {
            co(instance._daoModel.getOrderTicketInfo(req.params.id,1,req.query.activityid))
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
        ///执行签到
        this.app.post('/activityorder/:id/checkin', function (req, res) {
            co(instance._daoModel.checkin(req.params.id,1,req.body.userid))
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
    }
     
}
exports = module.exports = ActivityOrderController;