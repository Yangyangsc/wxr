/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var memberDao = require('../../model/crm/member');
var controllerBase = require('../../core/controllerBase');
var utility =require('../../core/utilities/utilities');
class MemberController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new memberDao());
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
        this.app.put('/member/:id/disable', function (req, res) {
            var disable=utility.checkValue(req.body.disable,1);
            co(instance._daoModel.setMemberDisabled(req.params.id,disable))
                .then(result =>res.json({successed:true}))
                .catch(result=>res.json(result));
        });
        //#处理获取实体列表的路由函数
        this.app.get('/member/:id/groups', function (req, res) {
            co(instance._daoModel.getMemberGroupsInfo(req.params.id))
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });
        //#获取会员消费记录
        this.app.get('/member/:id/consume', function (req, res) {
           co(instance.getListData(req, "consume"))
                .then(result =>{
                    ///获取汇总的统计信息
                    instance._daoModel.getUserTotalConsume(
                        req.params.id,
                        (req.body && req.body['type'])||(req.query && req.query['type']),
                        (req.body && req.body['startDate'])||(req.query && req.query['startDate']),
                        (req.body && req.body['endDate'])||(req.query && req.query['endDate'])
                    ).then(sumResult=>{
                        if (sumResult.rows.length==1){
                            var sumItem = sumResult.rows[0];
                            result.footer=[{memo:'合计',total:sumItem.total}];
                        }
                        instance.responseResult(req,res,result);
                    })
                    .catch(sumResult=>res.json(result))
                })
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });

        //#获取用户的会员清单
        this.app.get('/member/:id/membertype', function (req, res) {
           co(instance._daoModel.getUserMemberTypes(req.params.id))
                .then(result =>res.json(result))
                .catch(result=>res.json(result))
        });
        //#获取用户的会员清单
        this.app.get('/member/:id/label', function (req, res) {
           co(instance._daoModel.getUserLabelInfo(req.params.id))
                .then(result =>res.json(result))
                .catch(result=>res.json(result))
        });
        //#处理获取实体列表的路由函数
        this.app.get('/member', function (req, res) {
            co(instance.getListData(req, "member"))
                .then(result =>instance.responseResult(req,res,result))
                .catch(result => { console.log(result); instance.responseResult(req,res,result); })
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/member/joingroup', function (req, res) {
            co(instance._daoModel.joinGroup(req.body.groupid,req.body.userid))
                .then(result => res.json(result))
                .catch(result=> res.json(result));
        });
         //#处理提交新增实体记录的路由配置
        this.app.post('/member/usermember', function (req, res) {
            co(instance.create(req, "usermember",instance._daoModel.insertUserMemberTypeSql))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#处理提交新增实体记录的路由配置
        this.app.post('/member', function (req, res) {
            co(instance.create(req, "member"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#获取用户的某个入会类型信息
        this.app.get('/member/usermember/:id', function (req, res) {
            co(instance.getDataById(req, "usermember",instance._daoModel.getUserMemberTypeSql))
                .then(result =>res.json(result))
                .catch(result =>res.json(result));
        });
        //#获取详细记录的路由配置
        this.app.get('/member/:id', function (req, res) {
            co(instance.getDataById(req, "member"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });

         //#获取用户的某个入会类型信息
        this.app.put('/member/usermember/:id', function (req, res) {
            co(instance.update(req, "usermember",instance._daoModel.updateUserMemberTypeSql))
                .then(result =>res.json(result))
                .catch(result =>res.json(result));
        });
        //#处理更新实体记录的路由配置
        this.app.put('/member/:id', function (req, res) {
            co(instance.update(req, "member"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#将用户从会员类型中移除
        this.app.delete('/member/usermember/:id', function (req, res) {
             co(instance.delete(req, req.params.id,instance._daoModel.deleteUserMemberTypeSql))
                .then(result => res.json(result))
                .catch(result=> res.json(result));
        });
        //#从群里面移除会员
        this.app.delete('/member/removegroup', function (req, res) {
            co(instance._daoModel.removeFromGroup(req.body.groupid,req.body.userid))
                .then(result => res.json(result))
                .catch(result=> res.json(result));
        });
        
    }
}
exports = module.exports = MemberController;