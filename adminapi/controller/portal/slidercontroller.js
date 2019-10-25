/*
* 自动生成代码(Auto-generated)
* 实体业务模型的控制器类
* 该类由代码自动生成
* 各种业务处理的控制写在此处
*/
var co = require('co');
var silderDao = require('../../model/portal/slider');
var controllerBase = require('../../core/controllerBase');
var utility=require('../../core/utilities/utilities');
class SliderController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new silderDao());
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
        this.app.get('/slider/checkkey', function (req, res) {
            co(instance._daoModel.getSameKeyCount(req.query.key,req.query.id))
                .then(result =>res.json({successed:true,existed:result.rows[0].total>=1}))
                .catch(result =>res.json(result))
        });
        this.app.get('/slider', function (req, res) {
            co(instance.getListData(req, "slider"))
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });

        //#处理提交新增实体记录的路由配置
        this.app.post('/slider', function (req, res) {
            co(instance.create(req, "slider"))
                .then(result => { instance.responseResult(req,res,result) })
                .catch(result =>{ instance.responseResult(req,res,result) });
        });
        //#获取幻灯片下的图片
        this.app.get('/slider/:id/images', function (req, res) {
            co(instance._daoModel.getSliderImages(req.params.id))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        //#获取详细记录的路由配置
        this.app.get('/slider/:id', function (req, res) {
            co(instance.getDataById(req, "slider"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        
        //#处理更新实体记录的路由配置
        this.app.put('/slider/:id', function (req, res) {
            co(instance.update(req, "slider"))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=> { instance.responseResult(req,res,result); });
        });
        //#处理删除实体记录的路由配置
        this.app.delete('/slider/:id', function (req, res) {
            co(instance.delete(req, req.params.id))
                .then(result => instance.responseResult(req,res,result))
                .catch(result=>{instance.responseResult(req,res,result);});
        });

        //获取用户的列表
        this.app.get('/getuser', function (req, res) {
            co(instance.getListData(req, "member2"))
                .then(result =>res.json(result))
                .catch(result =>res.json(result))
        });


        //#获取用户详细
        this.app.get('/getuser/:id', function (req, res) {
            co(instance.getListData(req, "crm_user_yhq"))
                .then(
                    function parse(result){
                        console.log(result)
                        let yhq_temp
                        if (result["rows"].length === 1){
                            if(result.rows[0].yhq === '0'){
                                yhq_temp = [{id:null,yhq:"没有可用优惠券",used:null,selected:null}]
                            }
                            else{
                                yhq_temp = [{id:result.rows[0].id,yhq:result.rows[0].yhq,used:result.rows[0].used,selected:result.rows[0].selected}]
                            }
                            result.rows={
                                id:result.rows[0].id,
                                name:result.rows[0].name,
                                yhq:yhq_temp
                            }
                            return res.json(result)
                        }
                        else{
                            var all_yhq = []
                            for(var i=0;i<result["rows"].length;i++){
                                var temp_yhq = {
                                    id:result["rows"][i]["id"],
                                    yhq:result["rows"][i]["yhq"],
                                    used:result["rows"][i]["used"],
                                    selected:result["rows"][i]["selected"]
                                }
                                if(temp_yhq.selected===1){
                                    all_yhq.unshift(temp_yhq)
                                }
                                else
                                    all_yhq.push(temp_yhq)
                            }
                            
                            result["rows"]={id:result.rows[0].id,name:result.rows[0].name,yhq:all_yhq}
                            return res.json(result)
                        }
                        
                    }
                )
                .catch(result =>function (req,res){
                    if (result["rows"].length === 1){
                        result.rows={id:result.rows[0].id,name:result.rows[0].name,yhq:result.rows[0].used,selected:result.rows[0].selected}
                        return res.json(result)
                    }
                    else{
                        var all_yhq = []
                        for(var i=0;i<result["rows"].length;i++){
                            console.log(result["rows"][i])
                            var temp_yhq = {
                                id:result["rows"][i]["id"],
                                yhq:result["rows"][i]["yhq"],
                                used:result["rows"][i]["used"],
                                selected:result["rows"][i]["selected"]
                            }
                            if(temp_yhq.selected===1){
                                all_yhq.unshift(temp_yhq)
                            }
                            else
                                all_yhq.push(temp_yhq)
                        }
                        
                        result["rows"]={id:result.rows[0].id,name:result.rows[0].name,yhq:all_yhq}
                        return res.json(result)
                    }
                    
                })

        });

        //#处理更新用户的优惠券信息
        this.app.put('/getuser/:id', function (req, res) {
            if(!req.body.business){
                return res.json({successed: true,comment:"nothing to do"})
            }

            console.log(req.params)
            let sql_query = "select id,uid,yhq from crm_user_yhq where id = "+req.body.business
            co(instance.getDataById(req,"yhq2uid",sql_query))
                .then(function update(result){
                    let update_crm_user = 'update crm_user set yhq='+result.rows.yhq+ " where user_id="+'"'+result.rows.uid+'"' 
                    req.body.yhq=result.rows.yhq
                    req.body.user_id=result.id
                    co(instance.update(req,"crm_user" ,update_crm_user))
                })
                .catch(result => {instance.responseResult(req,res,result);});
            let update_crm_user_yhq_1 = "update crm_user_yhq set selected=0"+" where uid= "+'"'+req.params.id+'"'+"and "+"selected=1"
            co(instance.update(req,"",update_crm_user_yhq_1))


            let update_crm_user_yhq = "update crm_user_yhq set selected=1"+" where id= "+req.body.business
            co(instance.update(req,"",update_crm_user_yhq))
                .then(result => {instance.responseResult(req,res,result);})
                .catch(result => {instance.responseResult(req,res,result);})

        });


        // 获取所有问题列表
        // this.app.get("/question",function(req,res){
        //     co(instance.getListData(req, "question"))
        //         .then(result =>res.json(result))
        //         .catch(result =>res.json(result))
        // })
        this.app.get("/question",function(req,res){
            console.log("/question");
            co(instance.getListData(req, "question"))
                .then(result =>{
                    co(instance.getQuestion(result))
                        .then(result => res.json(result))
                })
                .catch(result =>res.json(result))
        })

        
        // 获取问题详细信息
        this.app.get('/question/:id', function (req, res) {
            let query_sql = "select * from crm_user_yhq_qa where id="+req.params.id
            co(instance.getDataById(req, "question",query_sql))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        });
        // 更新问题
        this.app.put("/question/:id", function(req,res){
            var parmas = req.body
            var question_id = req.params.id
            var update_sql = "update crm_user_yhq_qa set "
            for (var key in parmas){
                update_sql += key+"="+"'"+parmas[key]+"'"+","
            }
            update_sql = update_sql.slice(0,update_sql.length-1)+" where id="+question_id
            co(instance.update(req, "question",update_sql))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        })
        
        // 添加问题
        this.app.post('/question',function(req,res){
            let sql="insert into crm_user_yhq_qa set ?"
            co(instance.create(req,"add_question",sql))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => instance.responseResult(res,res,result))
        })


        // 获取所有成绩
        this.app.get("/socre",function(req,res){
            
            req.query.activity_id = req.query.activity_id=="-1" ? null : req.query.activity_id
            let name = req.query.name
            let before = req.query.before
            let after = req.query.after
            console.log(req.params)
            if((((before && after)) && !name)){
                //let query_sql = 'select SQL_CALC_FOUND_ROWS * from (select  @id:=@id+1 AS id,temp.user_name as name,temp.createTime,temp.endTime,temp.usedtime,temp.hard,temp.rightlist,temp.wronglist,temp.score,temp.activity_id from (select uid,user_name,createTime,endTime,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,hard,rightlist,wronglist,score,activity_id from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " ORDER BY score DESC,hard desc,usedtime) as temp,(select @id:=0) as r  GROUP BY uid ORDER BY id) as temp where score between '+ before+" and "+after
                let query_sql = 'select SQL_CALC_FOUND_ROWS * from(select @id:=@id+1 AS id,temp.user_name as name,temp.createTime,temp.endTime,temp.usedtime,temp.hard,temp.rightlist,temp.wronglist,temp.score,temp.activity_id,temp.activity_topic from (select uid,user_name,createTime,endTime,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,hard,rightlist,wronglist,score,crm_user_yhq_result.activity_id, act_activity.activity_topic from crm_user_yhq_result LEFT JOIN act_activity on crm_user_yhq_result.activity_id=act_activity.activity_id LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " GROUP BY uid,activity_id ORDER BY score DESC,hard desc,usedtime) as temp,(select @id:=0) as r  ORDER BY id) as temp where score between '+ before+" and "+after
                co(instance._daoModel.query(query_sql))
                    .then(result => instance.responseResult(req,res,result))
                    .catch(result => {instance.responseResult(req,res,result);});
            }
            else{
                // let query_sql = ' select SQL_CALC_FOUND_ROWS * from (select  @id:=@id+1 AS id,temp.user_name as name,temp.createTime,temp.endTime,temp.usedtime,temp.hard,temp.rightlist,temp.wronglist,temp.score,temp.activity_id from (select uid,user_name,createTime,endTime,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,hard,rightlist,wronglist,score,activity_id from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " ORDER BY score DESC,hard desc,usedtime) as temp,(select @id:=0) as r  GROUP BY uid ORDER BY id) as temp '
                let query_sql = 'select SQL_CALC_FOUND_ROWS * from(select @id:=@id+1 AS id,temp.user_name as name,temp.createTime,temp.endTime,temp.usedtime,temp.hard,temp.rightlist,temp.wronglist,temp.score,temp.activity_id,temp.activity_topic from (select uid,user_name,createTime,endTime,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,hard,rightlist,wronglist,score,crm_user_yhq_result.activity_id, act_activity.activity_topic from crm_user_yhq_result LEFT JOIN act_activity on crm_user_yhq_result.activity_id=act_activity.activity_id LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " GROUP BY uid,activity_id ORDER BY score DESC,hard desc,usedtime) as temp,(select @id:=0) as r  ORDER BY id) as temp'
                if(!req.query.name&&!req.query.activity_id){
                    co(instance._daoModel.query(query_sql))
                    .then(result => instance.responseResult(req,res,result))
                    .catch(result => {instance.responseResult(req,res,result);});
                }
                else if(!req.query.activity_id){
                    query_sql = query_sql+' where name like "%'+req.query.name+'%"'
                    co(instance._daoModel.query(query_sql))
                    .then(result => instance.responseResult(req,res,result))
                    .catch(result => {instance.responseResult(req,res,result);});
                }else if(!req.query.name){
                    query_sql = query_sql+' where activity_id= "'+req.query.activity_id+'"'
                    co(instance._daoModel.query(query_sql))
                    .then(result => instance.responseResult(req,res,result))
                    .catch(result => {instance.responseResult(req,res,result);});
                }else{
                    query_sql = query_sql+' where name like "%'+req.query.name+'%" and activity_id="'+req.query.activity_id+'"'
                    co(instance._daoModel.query(query_sql))
                    .then(result => instance.responseResult(req,res,result))
                    .catch(result => {instance.responseResult(req,res,result);});
                }
            }
        })

        //活动名称下拉表
        this.app.get("/aname",function(req,res){
            let sql='select activity_id,activity_topic from act_activity where activity_id in(select DISTINCT activity_id from crm_user_yhq_result where activity_id IS NOT NULL and endTime !=" ")'
            co(instance._daoModel.query(sql))
                    .then(result => {
                        if (result.successed) {
                            result.rows.unshift({activity_id:"-1",activity_topic:"全部活动"})
                        }
                        instance.responseResult(req,res,result)
                    })
                    .catch(result => {instance.responseResult(req,res,result);});
        });

        // 修改成绩
        this.app.put("/socre/:id", function(req,res){
            var parmas = req.body
            var question_id = req.params.id
            console.log(req.params)
            var update_sql = "update crm_user_yhq_result set "
            for (var key in parmas){
                update_sql += key+"="+"'"+parmas[key]+"'"+","
            }
            update_sql = update_sql.slice(0,update_sql.length-1)+" where crm_yhq_result.id="+question_id
            co(instance.update(req, "socre",update_sql))
                .then(result => instance.responseResult(req,res,result))
                .catch(result => {instance.responseResult(req,res,result);});
        })
        
        // 根据uid获取历史成绩
        this.app.get("/socre/", function (req, res) { 
            let uid = req.query.uid
            let sql = ""
        })
    }

    *getQuestion(questions) {
        let rightlists_sql = 'select rightlist,wronglist from  crm_user_yhq_result where endTime!=" "'
        let rightlists = yield this._daoModel.query(rightlists_sql)
        let myMap = new Map()
        for (var i of eval(rightlists.rows)) {
            let rightlist = eval(i.rightlist)
            let wronglist = eval(i.wronglist)
            let all_list = rightlist.concat(wronglist)
            for (var j of all_list) {
                if (rightlist.indexOf(j) > -1) {
                    if (myMap.get(j)) {
                        myMap.get(j)[0] = myMap.get(j)[0] + 1
                        myMap.get(j)[1] = myMap.get(j)[1] + 1 
                    }
                    else { 
                        myMap.set(j,[1,1])
                    }
                }
                else { 
                    if (myMap.get(j)) {
                        myMap.get(j)[1] = myMap.get(j)[1] + 1
                    }
                    else {
                        myMap.set(j, [0, 1])
                    }
                }      
            }
        }
        console.log(myMap)
        for (var question of questions.rows) {
           
                if (question.img) {
                    // question.img = question.img.replace(/\\/g,'/')
                   // question.img = 'http://image.huanxinkeji.cn'+question.img 
                }
            
            question.accuracy = myMap.get(question.id) ? (((myMap.get(question.id)[0] / myMap.get(question.id)[1]) * 100)).toFixed(2) + '%' : '0%'      // 正确率
            var question_info = ''
            if (myMap.get(question.id)) {
                question_info = "(" + myMap.get(question.id)[0] + '/' + myMap.get(question.id)[1] + ")"
            }
            else { 
                question_info = '(0/0)'
            }
            question.accuracy = question.accuracy +"\t"+ question_info
        }
        return questions
    }


}
exports = module.exports = SliderController;
