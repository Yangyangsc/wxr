/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var activityDao = require('../../model/act/activity');
var controllerBase = require('../../core/controllerBase');
var oss = require("../../core/utilities/aLiYunOSSUtility.js");
var richtextDao = require('../../model/bas/richtext');
var dataBusiness = require('../../model/dataBusiness');
var utility = require('../../core/utilities/utilities');
const OrderJsonKey2Chinese={
        company:"公司",
        position:"职位",
        name:"名称",
        mobile:"电话",
        phone:"电话",
        wechat:"微信",
        business:"所在行业",
        city:"所在城市",
        annualsales:"年销售额",
        ipo:"上市计划",
        investment:"投资计划"
    };
class ActivityController extends controllerBase {
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
        this.app.get('/activity/checkin', function (req, res) {
            co(instance._daoModel.getActivity4CheckIn())
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
        ///获取单一活动的所有签到按钮
        this.app.get('/activity/:id/checkinbuttons', function (req, res) {
            co(instance._daoModel.getActivityCheckInButtons(req.params.id))
                .then(result => res.json(result))
                .catch(result =>res.json(result))
        });
        ///获取活动的所有票务类型汇总
        this.app.get('/activity/:id/ticketsummary', function (req, res) {
            co(instance._daoModel.getActivityTicketsAnalysis(req.params.id))
                .then(result => {
                    var sTotal=0,sCount=0,sTotal1=0,sCount1=0;
                    result.rows.forEach(rowItem=>{
                        sTotal += rowItem.total;
                        sCount += rowItem.count;
                        sTotal1+= rowItem.channeltotal;
                        sCount1+= rowItem.channelcount;
                    });
                    result.footer=[{ticket_title:'合计',total:sTotal,count:sCount,channeltotal:sTotal1,channelcount:sCount1}];
                    console.log(result);
                    instance.responseResult(req,res,result)}
                )
                .catch(result =>res.json(result))
        });
        ///获取活动的所有渠道销售汇总
        this.app.get('/activity/:id/channelsummary', function (req, res) {
           co(instance.getListData(req, "activitychannelsales"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result =>res.json(result))
        });
        this.app.get('/activity/:id/orders', function (req, res) {
            co(instance.getListData(req, "activityorders"))
                .then(result => {
                    ///如果是导出订单,需要导出json 
                    let export2Excel =utility.checkValue(req.query.exportexcel,"false").toLowerCase()==="true";

                    if (result.successed && result.rows && export2Excel){
                        result.rows.forEach(rowItem=>{
                                var retValue = '';
                                if(!utility.isNullOrEmpty(rowItem.enrolljson)){
                                        var data = JSON.parse(rowItem.enrolljson);
                                        Object.keys(data).forEach(function(item,index){
                                            retValue = retValue+OrderJsonKey2Chinese[item]+" : "+data[item]+"\r\n";
                                        })
                                }
                                rowItem.enrolldata= retValue;
                        })
                    }
                    instance.responseResult(req,res,result);
                })
                .catch(result =>res.json(result))
        });
        this.app.get('/activity', function (req, res) {
            co(instance.getListData(req, "activity"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/activity', function (req, res) {
            co(instance.create(req, "activity"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#获取详细记录的路由配置
        this.app.get('/activity/:id/gifttickets', function (req, res) {
            co(instance._daoModel.getActivityGiftsTickets(req.params.id))
                .then(result =>res.json(result))
                .catch(result=>res.json(result));
        });
        //#获取详细记录的路由配置
        this.app.get('/activity/:id/tickets', function (req, res) {
            co(instance._daoModel.getActivityTickets(req.params.id))
                .then(result =>res.json(result))
                .catch(result=>res.json(result));
        });
        //#获取详细记录的路由配置
        this.app.get('/activity/:id/channels', function (req, res) {
            co(instance._daoModel.getActivityChannels(req.params.id))
                .then(result =>{
                            var valueResult = {successed:true,rows:result.rows[0]}
                            instance.responseResult(req,res,valueResult);
                })
                .catch(result =>instance.responseResult(req,res,result));
        });
        //#获取详细记录的路由配置
        this.app.get('/activity/:id', function (req, res) {
            co(instance.getDataById(req, "activity"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        //#发布活动
        this.app.put('/activity/:id/publish', function (req, res) {
            co(instance._daoModel.publishActivity(req.params.id))
                .then(result => res.json(result))
                .catch(result=> res.json(result));
        });
        //#处理更新实体记录的路由配置
        this.app.put('/activity/:id', function (req, res) {
            co(instance.update(req, "activity"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });

        //#处理删除实体记录的路由配置
        this.app.delete('/activity/:id', function (req, res) {
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
                    var result = yield  richDao.create(dataBusiness.Avtivity,sqlParams[req.primary],req.body.richtext);
                    if (result.successed) return { sql: sql, sqlParams: sqlParams };
                    return {canceled:true};
                case "update":
                    var result = yield  richDao.update(dataBusiness.Avtivity,req.params.id,req.body.richtext);
                    if (result.successed) return { sql: sql, sqlParams: sqlParams };
                    return {canceled:true};
                // case "delete":
                //     var result = yield  richDao.delete(dataBusiness.Avtivity,req.params.id);
                //     if (result.successed) return { sql: sql, sqlParams: sqlParams };
                //     return {canceled:true};
            }
            return { sql: sql, sqlParams: sqlParams }
        });
    }
}
exports = module.exports = ActivityController;