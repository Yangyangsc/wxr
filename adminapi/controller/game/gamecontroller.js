/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var gameDao = require('../../model/portal/game');
var controllerBase = require('../../core/controllerBase');
var utility=require('../../core/utilities/utilities');
class GameController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new gameDao());
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
        
        this.app.get('/game_rules', function (req, res) { 
            co(instance.game_rules(req,res))
                .then(result =>instance.responseResult(req, res, result))
                .catch(result =>instance.responseResult(req, res, result))
        });

        this.app.get('/game_rule/:id',function(req,res){
            co(instance.get_game_rule(req,res))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => instance.responseResult(res,res,result))
        });

        this.app.post('/game_rule/',function(req,res){
            co(instance.create_game_rule(req,res))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => instance.responseResult(res,res,result))
        });

        this.app.put('/game_rule/:id',function(req,res){
            co(instance.update_game_rule(req,res))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => instance.responseResult(res,res,result))
        });

        this.app.delete('/game_rule/:id',function(req,res){
            co(instance.del_game_rule(req,res))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => instance.responseResult(res,res,result))
        });
        // this.app.all('/game_rule/',function(req,res){
        //     let promise_result  = ''
        //     switch (req.method) {
        //         case "GET":
        //             promise_result = co(instance.get_game_rule(req,res))
        //             break;
        //         case "POST":
        //             promise_result = co(instance.create_game_rule(req,res))
        //             break;
        //         case "DELETE":
        //             promise_result = co(instance.del_game_rule(req,res))
        //             break;
        //         case "PUT":
        //             promise_result = co(instance.update_game_rule(req,res))
        //             break;
        //         default:
        //             return {data:[],code:1,message:'This method is not supporte'}
        //     }
        //     promise_result
        //         .then(result => instance.responseResult(req,res,result))
        //         .catch(result => instance.responseResult(res,res,result))
        // })


    }


    *game_rules(req,res){
        console.log("................")
        console.log(req.params)
        console.log("......................")
        console.log(req.query)
        let keyword = req.query.keyword
        let offset = req.query.rows?req.query.rows:5
        let page = req.query.page?req.query.page:1
        let sql = ''
        let total_sql = ''
        if (keyword) {
            sql = `select crm_game_rule.*,act_activity.activity_topic from crm_game_rule left join act_activity on crm_game_rule.activity_id=act_activity.activity_id where rule like "%${keyword}%" or act_activity.activity_id like "%${keyword}%" or act_activity.activity_topic like "%${keyword}%" limit ${(page-1)*offset},${page*offset}` 
            total_sql = `select count(1)  as total from crm_game_rule left join act_activity on crm_game_rule.activity_id=act_activity.activity_id where rule like "%${keyword}%" or act_activity.activity_id like "%${keyword}%" or act_activity.activity_topic like "%${keyword}%"`
        }else{
            sql = `select crm_game_rule.*,act_activity.activity_topic from crm_game_rule left join act_activity on crm_game_rule.activity_id=act_activity.activity_id limit ${(page-1)*offset},${page*offset}` 
            total_sql = "select count(1)  as total from crm_game_rule "
        }
        
        let result = yield this._daoModel.query(sql)
        let total_result = yield this._daoModel.query(total_sql)
        if (result.rows) {
            return {rows:result.rows,code:0,message:"success",total:total_result.rows[0].total}
        } else {
            return {rows:[],code:1,message:"fail"}
        }
    }
    
    *get_game_rule(req,res){
        let id = req.params.id
        let sql = ''
        console.log(id)
        if (id) {
            sql = `select crm_game_rule.*,act_activity.activity_topic from crm_game_rule left join act_activity on crm_game_rule.activity_id=act_activity.activity_id where id = ${id} `
        }else{
            return {rows:[],code:1,successed:false,msg:'参数错误'}
        }
        let result = yield this._daoModel.query(sql)
        if (result.rows) {
            return {rows:result.rows[0],successed:true,page:1,total:1}
        } else {
            return {rows:[],code:1,successed:false}
        }
    }

    *create_game_rule(req,res){
        let rule = req.body.richtext
        let used = req.body.used
        let activity_id = req.body.activity_id
        if (!rule && !activity_id) {
            return {code:1,successed:false,msg:'参数错误'}
        }else if(used!=0 && used!=1){
            return {code:1,successed:false,msg:'参数错误'}
        }else{
            
        }
        let sql = `insert crm_game_rule(rule,used,activity_id) value("${rule}","${used}","${activity_id}")`
        let result = yield this._daoModel.query(sql)
        if (result.rows.affectedRows) {
            return {code:0,successed:true}
        } else {
            return {code:1,successed:false}
        }
    }

    *del_game_rule(req,res){
        let id = req.params.id;
        let sql = `delete from crm_game_rule where id=${id}`
        let result = yield this._daoModel.query(sql)
        console.log(result)
        if (result.rows.affectedRows) {
            return {code:0,successed:true}
        } else {
            return {code:1,successed:false}
        }
    }

    *update_game_rule(req,res){
        console.log(req.params)
        console.log(req.query)
        console.log(req.body)
        let id = req.params.id
        let rule = req.body.richtext
        let used = req.body.used
        let activity_id = req.body.activity_id
        if (used==1) {
            let update_sql = 'update crm_game_rule set used=0 where used=1'
            yield this._daoModel.query(update_sql)
        }
        let sql = `update crm_game_rule set rule="${rule}", used="${used}" ,activity_id="${activity_id}" where id=${id}`
        let result = yield this._daoModel.query(sql)
        if (result.rows.affectedRows) {
            return {code:0,successed:true}
        } else {
            return {code:1,successed:false}
        } 
    }
    

}
exports = module.exports = GameController;
