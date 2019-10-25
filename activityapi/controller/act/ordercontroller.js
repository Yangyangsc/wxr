var co = require('co');
var orderDao = require('../../model/act/order');
var controllerBase = require('../../core/controllerBase');
var uuid = require('node-uuid');
var errEnum = require("../../common/enum");
var validator = require("validator");
var pfMsg = require("../../common/message");
var msgConfig = require("../../message.json");
const qrcodeUtility = require("../../core/utilities/qrcodeUtility");
var config = require('../../configuration.json');
const util = require('util');
const qrcode = require('qr-image');

/**
 * 票务订单
 */
class OrderController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new orderDao());
    }

    /*
    * 初始化控制器中的路由
    * 以下由代码生成器默认添加了增删改查的几个路由处理器，开发人员
    * 根据实际情况可以继续添加其他路由，或删除现有路由
    */
    initializeRouter(instance) {
        //#获取详细记录的路由配置
        this.app.post('/orders', function (req, res) {
            console.log("post-orders");
            co(instance.createOrder(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => {
                    console.log(result);
                    instance.responseResult(req, res, result);
                });
        });

        this.app.get('/orders', function (req, res) {
            console.log("get-orders");
            co(instance.getOrders(req.query.uid, req.query.page, req.query.rows))
                .then(result =>
                    instance.responseResult(req, res, result))
                .catch(result => {
                    console.log(result);
                    instance.responseResult(req, res, result);
                });
        });



        this.app.get('/orders/:id/ticket', function (req, res) {
            console.log("/orders/:id/ticket");
            let uid = Object.keys(req.query)[0]
            co(instance.getOrderTicket(req.params.id))
                .then(result => instance.update_yhq2(instance, req, res, result, uid))
                .catch(result => {
                    console.log(result);
                    instance.responseResult(req, res, result);
                });
        });

        //查询优惠券
        this.app.get('/getyhq', function (req, res) {
            console.log("/getyhq");
            co(instance.getYhq(req.query.uid, req.query.page, req.query.rows))
                .then(result =>
                    instance.responseResult(req, res, result))
                .catch(result => {
                    console.log(result);
                    instance.responseResult(req, res, result);
                });
        });

        //修改优惠券
        this.app.post('/edityhq', function (req, res) {
            console.log("/edityhq");
            co(instance.editYhq(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => {
                    console.log(result);
                    instance.responseResult(req, res, result);
                });
        });




        //分享
        this.app.get('/toshare', function (req, res) {
            console.log("/toshare");
            let weChat = config.weChat
            let sharePage = weChat.sharePage
            let link = req.query.link;

            let reg = new RegExp(sharePage, 'ig')
            reg = reg.test(link)
            //在 configuration weChat sharePage 配置的链接相匹配，分享数量才会加1
            if (reg || sharePage == '') {
                co(instance.toShare(req))
                    .then(result => instance.responseResult(req, res, result))
                    .catch(result => {
                        console.log(result);
                        instance.responseResult(req, res, result);
                    });
            }
        });

        //开始页
        this.app.get('/startpage', function (req, res) {
            console.log("/startpage");
            co(instance.getStartPageData(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => {
                    instance.responseResult(req, res, result)
                })

        });

        //开始答题
        this.app.get('/starting', function (req, res) {
            console.log("/starting");
            co(instance.getQuestion(req))
                .then(result => instance.responseResult(req, res, result))
        })

        //我的优惠券list
        this.app.get('/myyhqlist', function (req, res) {
            console.log("/myyhqlist");
            co(instance.getmyyhqlist(req))
                .then(result => instance.responseResult(req, res, result))
        })

        //我的优惠券detail
        this.app.get('/myyhqdetail', function (req, res) {
            console.log("/myyhqdetail");
            co(instance.getmyyhqdetail(req))
                .then(result => instance.responseResult(req, res, result))
        })

        //我的排行榜
        this.app.get('/myphb', function (req, res) {
            console.log("/myphb");
            co(instance.getmyphb(req))
                .then(result => instance.responseResult(req, res, result))
            //.then(result=> instance.addYhq(req,res,result))

        })


        //提交答案
        this.app.post('/checkanswer', function (req, res) {
            co(instance.checkAnswer(req))
                .then(result => instance.responseResult(req, res, result))
        })

        //
        this.app.get('/updateyhq', function (req, res) {
            co(instance.update_select_yhq(req))
                .then(result => instance.responseResult(req, res, result))
        })

        this.app.get('/getinitdata',function (req,res){
            co(instance.getinitdata(req))
                .then(result => instance.responseResult(req, res, result))
        })

        this.app.get('/getinitdata',function (req,res){
            co(instance.getinitdata(req))
                .then(result => instance.responseResult(req, res, result))
        })

        
        this.app.get('/getgamerule',function (req,res){
            co(instance.getgamerule(req))
                .then(result => instance.responseResult(req, res, result))
        })
    }

    * createOrder(req) {
        let openid = req.body.openid || "";
        let userid = req.body.userid || "";
        let mobile = req.body.mobile;
        let ticketid = req.body.ticketid;
        let total = req.body.total;
        let usernamef = req.body.username || "";
        let defaultenroll = usernamef ? 0 : 1;
        // if (!usernamef) return { successed: false, error: 2002, message: errEnum.RESULT_ERROR_ENUM[2002] };
        if ((!openid && !userid) || (!userid && !validator.isUUID(userid)))
            return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        if (mobile && !validator.isMobilePhone(mobile, "zh-CN")) return {
            successed: false,
            error: 3002,
            message: errEnum.RESULT_ERROR_ENUM[3002]
        };
        if (!ticketid || !validator.isUUID(ticketid)) return {
            successed: false,
            error: 1005,
            message: errEnum.RESULT_ERROR_ENUM[1005]
        };
        if (!total || total < 0) return { successed: false, error: 1006, message: errEnum.RESULT_ERROR_ENUM[1006] };
        let company = req.body.company || "";
        let position = req.body.position || "";
        let channelid = req.body.channelid || "";
        if (channelid && !validator.isUUID(channelid)) return {
            successed: false,
            error: 1013,
            message: errEnum.RESULT_ERROR_ENUM[1013]
        };
        let tickettype = req.body.tickettype || 0;
        let orderid = uuid.v4();
        let enrollid = uuid.v4();
        let orderno = orderid.replace(/-/g, "");
        let giftid = req.body.giftid || "";
        let enrolljson = req.body.enrolljson || "";
        let yhq = req.body.yhq || 0;

        let entity = [
            orderid, orderno, openid, userid, defaultenroll, enrollid, enrolljson, usernamef, mobile, company, position,
            ticketid, total, channelid, giftid, tickettype, yhq
        ]

        let result = yield this._daoModel.createOrder(entity);
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            let dbresult = result.rows[0][0];
            if (dbresult.result != 0 && dbresult.result != 1018) {
                return { successed: false, error: dbresult.result, message: errEnum.RESULT_ERROR_ENUM[dbresult.result] };
            } else if (dbresult.result == 1018) {
                let imgpath = yield qrcodeUtility.saveQRImg(orderid, orderid + '.png');
                let savePath = yield this._daoModel.finishOrder([orderid, '', imgpath]);
                let smsTxt = dbresult.actsms; //? dbresult.actsms : msgConfig.buysuccess;
                if (smsTxt) {
                    let buysuccess = util.format(smsTxt, usernamef);
                    pfMsg.SMS({ "Mobile": mobile, "Content": buysuccess });
                }
            }
            return {
                "successed": true, rows: [{
                    orderid: orderid, orderno: orderno,
                    username: usernamef, enrollid: enrollid, mobile: mobile,
                    company: company, position: position, total: total, channelid: channelid,
                    finish: dbresult.finish
                }]
            };
        } else {
            return { "successed": false, message: "创建订单出错！" };
        }
    }

    * getOrders(userid, page, rows) {
        if (!userid) return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        page = page || 1;
        rows = rows || 20;
        let result = yield this._daoModel.getOrders([userid, page, rows]);
        if (result.rows != null && result.rows.length > 0) {
            return { successed: true, rows: result.rows[0] };
        }
        return { successed: false };
    }

    * getOrderTicket(orderid) {
        let result = yield this._daoModel.getOrderTicket(orderid);
        if (result.rows != null && result.rows.length == 2 && result.rows[0].length > 0) {
            return { successed: true, rows: result.rows[0] };
        }
        return { successed: false, message: "数据不存在", data: [] };
    }

    * getmyyhqlist(req) {
        let activity_id = req.query.activity_id
        let uid = req.query.uid
        //let sql = "select  crm_user_yhq.id as yhq_id,yhq,uid,crm_user_yhq.activity_id,activity_topic,activity_date_start,activity_date_end,crm_user_yhq.used from crm_user_yhq  left join act_activity  on crm_user_yhq.activity_id=act_activity.activity_id where uid=" + "'" + uid + "'" + ' and activity_date_start is not null  order by crm_user_yhq.id'

        let sql = `select  crm_user_yhq.id as yhq_id,yhq,uid,crm_user_yhq.activity_id,activity_topic,activity_date_start,activity_date_end,crm_user_yhq.used from crm_user_yhq  left join act_activity  on crm_user_yhq.activity_id=act_activity.activity_id where uid="${uid}" and crm_user_yhq.activity_id='${activity_id}' and activity_date_start is not null  order by crm_user_yhq.id`

        let query_result = yield this._daoModel.query(sql)
        let query_json_result = JSON.parse(JSON.stringify(query_result.rows))
        if (query_json_result.length > 0) {
            for (var i = 0; i < query_json_result.length; i++) {
                query_json_result[i].activity_date_start = query_json_result[i].activity_date_start.replace('T', ' ').split(".")[0]
                query_json_result[i].activity_date_end = query_json_result[i].activity_date_end.replace('T', ' ').split(".")[0]
            }
            return { successed: true, message: "获取成功", activity_id: activity_id, data: query_json_result }
        }
        return { successed: false, message: "数据不存在", activity_id: activity_id, data: [] };
    }


    * getmyyhqdetail(req) {
        let yhq_id = req.query.yhqid
        let sql = "select  crm_user_yhq.id as yhqID,yhq,uid,crm_user_yhq.activity_id,activity_topic,activity_date_start,activity_date_end from crm_user_yhq  left join act_activity  on crm_user_yhq.activity_id=act_activity.activity_id where crm_user_yhq.used=0 and id=" + "'" + yhq_id + "'"
        let query_result = yield this._daoModel.query(sql)
        let query_json_result = JSON.parse(JSON.stringify(query_result.rows))
        if (query_json_result.length > 0) {
            for (var i = 0; i < query_json_result.length; i++) {
                query_json_result[i].activity_date_start = query_json_result[i].activity_date_start.replace('T', ' ').split(".")[0]
                query_json_result[i].activity_date_end = query_json_result[i].activity_date_end.replace('T', ' ').split(".")[0]
            }
            return { successed: true, data: query_json_result }
        }
        return { successed: false, message: "数据不存在", data: [] };
    }

    * getmyphb(req, score = 0, activity_id='', action_type = 'myphb') {
        let uid = req.query.uid
        let result_id = req.query.result_id
        let page = req.query.page
        let rows = req.query.rows
        let allrightph = ''
        let isexist_sql = "select uid from crm_user_yhq_result where uid='" + uid + "'"
        console.log("select uid from crm_user_yhq_result where uid: "+isexist_sql)
        let return_data = { successed: true, data: {} }
        let sql = ''
        console.log('action_type', action_type,score,typeof(score))         // ,usedtime
        if (req.query.activity_id) {
            activity_id=req.query.activity_id
        }
        //sql = 'select  @rownum:=@rownum+1 AS rownum,temp.* from (select crm_user_yhq_result.uid,crm_user.user_name,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,crm_user.user_image,score,hard,rightlist,wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " ORDER BY score DESC,usedtime) as temp,(select @rownum:=0) as r  GROUP BY uid ORDER BY rownum'
        sql = `select ri.*,lf.rownum1 as allrightph from (SELECT * from (select  @rownum:=@rownum+1 AS rownum,temp.* from (select crm_user_yhq_result.createTime,crm_user_yhq_result.uid,crm_user.user_name,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,crm_user.user_image,score,hard,rightlist,wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " and activity_id='${activity_id}' ORDER BY score DESC,usedtime asc) as temp,(select @rownum:=0) as r  GROUP BY uid ORDER BY rownum) as r1 ) as ri LEFT JOIN (select * from (SELECT rownum1,uid from (select * from (select @rownum1:=@rownum1+1 AS rownum1,temp2.* from (select  @rownum:=@rownum+1 AS rownum,temp.uid from (select crm_user_yhq_result.uid,crm_user.user_name,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,crm_user.user_image,score,hard,rightlist,wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " and score=200 and activity_id='${activity_id}' ORDER BY score DESC,usedtime asc) as temp,(select @rownum:=0) as r  GROUP BY uid ORDER BY rownum) as temp2,(select @rownum1:=0) as r) as l) as temp3) as r
                ) as lf on ri.uid=lf.uid `
        if (action_type == 'checkanswer' && score!=200) {             // , usedtime, hard desc           
            sql = `select  @rownum:=@rownum+1 AS rownum,temp.* from (select * from (select crm_user_yhq_result.uid,crm_user.user_name,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,crm_user.user_image,score,hard,rightlist,wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " and uid!='${uid}' and activity_id='${activity_id}'
            UNION all select crm_user_yhq_result.uid, crm_user.user_name, UNIX_TIMESTAMP(endTime) - UNIX_TIMESTAMP(createTime) as usedtime, crm_user.user_image, score, hard, rightlist, wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid = crm_user.user_id  where crm_user_yhq_result.endTime != " " and id = ${result_id} and activity_id='${activity_id}') as temp1 ORDER BY score DESC,usedtime asc)
            as temp, (select @rownum:=0) as r  GROUP BY uid ORDER BY rownum`

            // sql = `select ri.*,lf.rownum_r as allrightph  from (select  @rownum:=@rownum+1 AS rownum,temp.* from (select * from (select crm_user_yhq_result.uid,crm_user.user_name,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,crm_user.user_image,score,hard,rightlist,wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " and uid!='${uid}' 
            // UNION all select crm_user_yhq_result.uid, crm_user.user_name, UNIX_TIMESTAMP(endTime) - UNIX_TIMESTAMP(createTime) as usedtime, crm_user.user_image, score, hard, rightlist, wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid = crm_user.user_id  where crm_user_yhq_result.endTime != " " and id = ${result_id}) as temp1 ORDER BY score DESC,usedtime)
            // as temp, (select @rownum:=0) as r  ORDER BY rownum) as ri LEFT JOIN 
            // (select  @rownum_r:=@rownum_r+1 AS rownum_r,uid from (select  @rownum:=@rownum+1 AS rownum,uid,score from (select * from (select createTime,crm_user_yhq_result.uid,crm_user.user_name,UNIX_TIMESTAMP(endTime)-UNIX_TIMESTAMP(createTime) as usedtime,crm_user.user_image,score,hard,rightlist,wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid=crm_user.user_id  where crm_user_yhq_result.endTime !=" " and uid!='${uid}' 
            // UNION all select createTime,crm_user_yhq_result.uid, crm_user.user_name, UNIX_TIMESTAMP(endTime) - UNIX_TIMESTAMP(createTime) as usedtime, crm_user.user_image, score, hard, rightlist, wronglist from crm_user_yhq_result LEFT JOIN crm_user on crm_user_yhq_result.uid = crm_user.user_id  where crm_user_yhq_result.endTime != " " and id = ${result_id}) as temp1 ORDER BY score DESC,createTime)
            // as temp, (select @rownum:=0) as r  ORDER BY rownum) as temp, (select @rownum_r:=0) as r WHERE temp.score=200) as lf on ri.uid=lf.uid`
        }
        let query_result = yield this._daoModel.query(sql, [page, rows])
        let result = query_result.rows
        for (var i = 0; i < result.length; i++) {
            let rightlist = eval(result[i].rightlist)
            let wronglist = eval(result[i].wronglist)
            let all_length = rightlist.length + wronglist.length
            let accuracy = parseInt((rightlist.length / all_length) * 100) + '%'
            result[i].accuracy = accuracy
            result[i].pm = i + 1
            result[i].allrightph = result[i].allrightph !== null ? result[i].allrightph : 0
            console.log('allrightph')
            console.log('-------------------')
            console.log(result[i].allrightph)
            console.log('------------------')
            result[i].defeat = parseInt(((result.length - i) / result.length) * 100) >= 100 ? '99.999%' : +parseInt(((result.length - i) / result.length) * 100) + '%'
            result[i].usedtime = parseInt(result[i].usedtime) > 200 ? 200 : result[i].usedtime
            if (uid == result[i].uid) {
                if (return_data.data.myself == undefined) {
                    return_data.data.myself = result[i]
                }
            }
        }
        var temp = []
        for (var i = (page - 1) * rows; i < page * rows; i++) {       //分页
            if (i >= result.length) {
                break
            }
            else {
                temp.push(result[i])
            }
        }
        return_data.data.phb = temp
        console.log(return_data)
        return return_data
    }


    * getYhq(userid, page, rows) {
        if (!userid) return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        let sql = "select * from crm_user_yhq where uid=? limit 1";

        let result = yield this._daoModel.getYhq(sql, [userid]);
        if (result.rows != null && result.rows.length > 0) {
            return { successed: true, rows: result.rows[0] };
        }
        return { successed: false };
    }

    * editYhq(req) {
        let userid = req.body.uid || "";
        if ((!userid))
            return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        let yhq = req.body.yhq || 0;

        let sql = "select * from crm_user_yhq where uid=? limit 1";
        let result = yield this._daoModel.getYhq(sql, [userid]);
        //是否有该用户的优惠券信息
        if (result.rows.length > 0) {
            let entity = [yhq, userid]
            sql = "update crm_user_yhq set yhq=? where uid=? ";
            result = yield this._daoModel.editYhq(sql, entity);
        } else {
            let entity = [userid, yhq]
            sql = "insert into crm_user_yhq(uid,yhq,create_date) value(?,?,now())";
            result = yield this._daoModel.editYhq(sql, entity);
        }
        if (result.rows != null) {
            return { "successed": true, message: "修改优惠券成功！", data: ['sucessed'] };
        } else {
            return { "successed": false, message: "修改优惠券失败！", data: [] };
        }
    }


    * toShare(req) {
        let userid = req.query.uid || "";
        if ((!userid))
            return { successed: false, error: 2001, message: errEnum.RESULT_ERROR_ENUM[2001] };
        let entity = [userid]
        let select_share_count = 'select share_count,take_count from crm_user where user_id=?'
        let query_result = yield this._daoModel.query(select_share_count, entity)
        let query_json_result = JSON.parse(JSON.stringify(query_result.rows))[0]
        let share_count = query_json_result.share_count
        let take_count = query_json_result.take_count
        if (share_count >= 1) {
            return { "successed": true, message: "达到了分享上限", share_count: share_count, take_count: take_count, data: [] }
        }
        let sql = "update crm_user set share_count=share_count+1,take_count=take_count+1 where user_id=? ";
        let result = yield this._daoModel.toShare(sql, entity);
        if (result.rows != null) {
            return { "successed": true, message: "分享成功！", share_count: share_count + 1, take_count: take_count + 1 };
        } else {
            return { "successed": false, message: "分享修改失败！", share_count: share_count, take_count: take_count, data: [] };
        }
    }


    * getStartPageData(req) {
        let user_id = req.query.uid
        console.log(user_id)
        let select_crm_user = "select user_name,share_count,take_count,user_sex,user_job from crm_user where user_id=?"
        let result = yield this._daoModel.query(select_crm_user, user_id)
        let query_json_result = result.rows[0]
        let info_is_complete = false
        console.log(query_json_result)
        if (!query_json_result) {
            return {
                code: '404',
                data: {}
            }
        }
        else {
            if (query_json_result.user_sex && query_json_result.user_job) {
                info_is_complete = true                
            }
            return { code: 200, data: { uid: user_id,info_is_complete:info_is_complete ,user_name: query_json_result.user_name, share_count: query_json_result.share_count, take_count: query_json_result.take_count } }
        }
    }

    * getQuestion(req) {
        let user_id = req.query.uid;
        let sex = req.query.sex;
        let job = req.query.jod;
        console.log("----------------------------")
        console.log(job)
        let select_take_count = 'select * from crm_user where user_id=?'
        let result = yield this._daoModel.query(select_take_count, user_id)
        let query_json_result = JSON.parse(JSON.stringify(result.rows))[0]
        if (!query_json_result) {
            return {
                code: 404,
                message: "用户不存在",
                data: []
            }
        }
        else if (query_json_result.take_count === 0) {
            return {
                code: 200,
                message: "机会已用完",
                data: []
            }
        }
        else {
            let result = []
            for (var i = 1; i < 5; i++) {
                var num = i <= 2 ? 3 : 2
                var sql = `select id,que,opt1,opt2,opt3,opt4,cat_id,ans,img from crm_user_yhq_qa where cat_id=? and del=0 order by rand() limit ${num}`
                var query_result = yield this._daoModel.query(sql, i)
                query_result = query_result.rows
                for (let index = 0; index < query_result.length; index++) {
                    const element = query_result[index];
                    if (element.img) {
                        element.img = element.img.replace(/\\/g,'/')
                        element.img = 'http://image.huanxinkeji.cn/'+element.img 
                    }
                }

                result = result.concat(query_result)
            }
            co(this._daoModel.query("update crm_user set take_count=take_count-1 where user_id=?", user_id))
            let final_result = {
                code: 200,
                data: result
            }

            let insert_start_time = 'insert into crm_user_yhq_result(uid,cat_id) value(?,?) '
            let update_user_info = 'update crm_user set user_sex=?,user_job=? where user_id=?'
            let insert_result = yield this._daoModel.query(insert_start_time, [user_id, job])
            if ((sex == 1 || sex==0) && job && user_id) {
                let update_result = yield this._daoModel.query(update_user_info,[sex,job,user_id])
            }
            let select_result = yield this._daoModel.query('select max(id) from crm_user_yhq_result where uid=' + '"' + user_id + '"')

            let result_id = JSON.parse(JSON.stringify(select_result.rows))[0]['max(id)']
            final_result.result_id = result_id
            return final_result
        }
    }

    * checkAnswer(req) {
        let answer_data = eval(req.body.data)
        let select_answer = "SELECT id,ans,hard,cat_id from crm_user_yhq_qa"
        let query_result = yield this._daoModel.query(select_answer)
        let qanda = query_result.rows
        let qanda_dict = {}                            // 问题答案 dict
        let activity_id = req.body.activity_id
        let id = req.body.resultID
        let hard = 0
        let score = 0
        let rightlist = []
        let wronglist = []
        let res_result = {
            code: 200,
            get_yhq: 1,
            score: 0,
            passed: 0,
            nopasswd: 0,
            data: [],
        }
        let rule_query_result = yield this._daoModel.query(`select activity_id from crm_game_rule where activity_id='${activity_id}'`)
        if (rule_query_result.rows.length>0) {
            activity_id = rule_query_result.rows[0].activity_id
            res_result.activity_id = activity_id
        }else{
            return {code:404,data:[],message:'该活动不存在'}
        }

        
        for (var i = 0; i < qanda.length; i++) {
            qanda_dict[qanda[i].id] = [qanda[i].ans, qanda[i].hard, qanda[i].cat_id]
        }

        for (var i = 0; i < answer_data.length; i++) {
            if (qanda_dict[answer_data[i].qid][0].toLocaleUpperCase() == answer_data[i].answer.toLocaleUpperCase()) {
                //score +=10
                score += 20
                hard += qanda_dict[answer_data[i].qid][1]
                rightlist.push(answer_data[i].qid)
                var temp = {}
                temp[answer_data[i].qid] = [true, qanda_dict[answer_data[i].qid][2]]
                res_result.data.push(temp)
            }
            else {
                var temp = {}
                temp[answer_data[i].qid] = [false, qanda_dict[answer_data[i].qid][2]]
                hard += qanda_dict[answer_data[i].qid][1]
                wronglist.push(answer_data[i].qid)
                res_result.data.push(temp)
            }
        }
        res_result.lev = score == 200 ? 10 : this.get_level(res_result)
        res_result.score = score
        res_result.passed = rightlist.length
        res_result.nopasswd = wronglist.length
        res_result.resultID = id

    
        let sql = `update crm_user_yhq_result set hard='${hard}',score='${score}',rightlist='[${rightlist}]',wronglist='[${wronglist}]',endTime=now(),activity_id='${activity_id}' where id='${id}'`

        co(this._daoModel.query(sql))
        let query_uid = yield this._daoModel.query("select uid from crm_user_yhq_result where id=" + res_result.resultID)
        let uid = JSON.parse(JSON.stringify(query_uid.rows))[0]['uid']
        req.query.uid = uid
        req.query.result_id = id
        req.query.page = 1
        req.query.rows = 20
        let action_type = 'checkanswer'
        let return_data = yield this.getmyphb(req, score,activity_id, action_type)
        res_result.pm = return_data.data.myself.pm
        let myself_data = return_data.data.myself
        let myself_pm = myself_data.pm
        let myself_score = res_result.score
        let aid = activity_id
        let insert_sql = 'insert into crm_user_yhq(uid,yhq,create_date,activity_id) value(?,?,now(),?) '
        let yhq_id = 0

        if (myself_score == 200) {
            if (myself_pm < 200) {
                let query_result = yield this._daoModel.query(insert_sql, [uid, 380, aid])
                yhq_id = query_result.rows.insertId
                console.log("insertId:" + query_result.rows.insertId)
            }
            else {
                let query_result = yield this._daoModel.query(insert_sql, [uid, 200, aid])
                yhq_id = query_result.rows.insertId
                console.log("insertId:" + query_result.rows.insertId)
            }
        }
        else {
            if (myself_score) {
                let query_result = yield this._daoModel.query(insert_sql, [uid, myself_score, aid])
                yhq_id = query_result.rows.insertId
                console.log("insertId:" + query_result.rows.insertId)
            }
            else {
                res_result.get_yhq = 0
            }

        }
        res_result.yhq_id = yhq_id
        res_result.defeat = return_data.data.myself.defeat
        req.query.yhqid = yhq_id
        let allrightph = 0
        if (score == 200) {
            // let sql = 'select  @rownum:=@rownum+1 AS rownum  from (select * from crm_user_yhq_result where score=200) as temp,(select @rownum:=0) as  r '
            // let result = yield this._daoModel.query(sql)
            // allrightph = result.rows[result.rows.length - 1]['rownum'] != null ? result.rows[result.rows.length - 1]['rownum'] : 0
            res_result.allrightph = return_data.data.myself.allrightph

        }
        else{
            res_result.allrightph = allrightph
        }
        if (res_result.get_yhq) {
            let max_scort = yield this._daoModel.query('select max(score) from crm_user_yhq_result where uid=? and endTime<FROM_UNIXTIME(UNIX_TIMESTAMP()-3)', uid)
            if (max_scort) {
                max_scort = max_scort.rows[0]['max(score)']
            }
            else {
                max_scort = 0
            }
            if (score > max_scort) {
                yield this.update_select_yhq(req)
            }
        }

        return res_result


    }

    * update_select_yhq(req) {
        // 答题完毕后点击立即购票时通过传过来的yhq_id更改crm_user 中的yhq字段的值和和crm_user_yhq 中的响应卷的select
        let yhqID = req.query.yhqid
        let select_sql = 'select uid,yhq from crm_user_yhq where id=?'
        let select_result = yield this._daoModel.query(select_sql, yhqID)
        if (select_result.rows.length != 1) {
            return { successed: true, message: "未找到该条记录操作失败", data: [] }
        }
        let uid = select_result.rows[0].uid
        let yhq = select_result.rows[0].yhq
        yield this._daoModel.query('update crm_user_yhq set selected=0 where uid=? and selected=1', uid)
        yield this._daoModel.query('update crm_user_yhq set selected=1 where id=?', yhqID)
        let result = yield this._daoModel.query('update crm_user set yhq=? where user_id=?', [yhq, uid])
        if (result.rows.affectedRows == 1) {
            return { successed: true, message: "操作成功", data: { yhq: yhq, yhqID: yhqID } }
        }
        else {
            return { successed: true, message: "操作失败", data: [] }
        }

    }
    update_yhq2(instance, req, res, result_init, uid) {
        let update_crm_yhq = 'update crm_user_yhq set used=1 ,selected=0 where uid=' + '"' + uid + '"' + ' and selected=1'
        co(this._daoModel.loadData(update_crm_yhq))

        let get_max_yhq = "select max(yhq) from crm_user_yhq where used=0 and uid=" + "'" + uid + "'"
        co(this._daoModel.loadData(get_max_yhq))
            .then(result => {
                this.max_yhq = JSON.parse(JSON.stringify(result.rows))[0]['max(yhq)']
                let update_crm_user = "update crm_user set yhq=" + this.max_yhq + " where user_id=" + "'" + uid + "'"
                console.log(update_crm_user)
                co(this._daoModel.loadData(update_crm_user))
                let select_mix_id = 'select min(id) from crm_user_yhq where  used=0 and yhq=' + this.max_yhq + " and uid=" + "'" + uid + "'"
                co(this._daoModel.loadData(select_mix_id))
                    .then(result => {
                        var id = JSON.parse(JSON.stringify(result.rows))[0]['min(id)']
                        var update_crm_yhq_select = "update crm_user_yhq set selected=1 where id=" + id
                        co(this._daoModel.loadData(update_crm_yhq_select))
                            .then(instance.responseResult(req, res, result_init))
                    })
            })

    }
    get_level(result) {
        let data = result.data
        let count = {
            type1: 0,          // 运营
            type2: 0,         // 文案
            type3: 0,         // 热点
            type4: 0,         // 技术
        }
        for (var i = 0; i < data.length; i++) {
            let key = Object.keys(data[i])[0]
            let question_info = data[i][key]
            console.log(question_info)
            switch (question_info[1]) {
                case 1:
                    count.type1 = question_info[0] ? count.type1 + 1 : count.type1 + 0;
                    break;
                case 2:
                    count.type2 = question_info[0] ? count.type2 + 1 : count.type2 + 0;
                    break;
                case 3:
                    count.type3 = question_info[0] ? count.type3 + 1 : count.type3 + 0
                    break;
                case 4:
                    count.type4 = question_info[0] ? count.type4 + 1 : count.type4 + 0
                    break;
            }
        }
        function sum() {
            var x = 0;
            for (var i = 0; i < arguments.length; ++i) {
                x += arguments[i];
            }
            return x;
        }
        console.log(count)
        let max_count = 0
        let max_type = ''
        let type_sum = sum(count.type1, count.type2, count.type3, count.type4)
        let type_temp = []
        for (var key in count) {
            if (count[key] >= max_count) {
                type_temp = []
                max_count = count[key]
                max_type = key
                type_temp.push(key)
            }
            else if (count[key] == max_count) {
                type_temp.push(key)
            }
        }
        console.log(max_count, max_type)
        if (type_sum == 10) {
            return '10'
        }
        else if (type_sum >= 8 && type_sum <= 9) {
            return '8'
        }
        else if (type_sum >= 6 && type_sum <= 7) {
            return '4'
        }
        else {
            return '9'
        }
        //     else if (max_count == 3) {
        //         switch (max_type) {
        //             case "type2":
        //                 return '3'
        //             case "type1":
        //                 return '7'
        //         }
        //     }
        //     else if (max_count == 1) { 
        //         if(count.type3==1){
        //             return '6'
        //         }else if(count.type4==1){
        //             return '2'
        //         }
        //         // switch (max_type) {
        //         //     case "type3":
        //         //         return '6'
        //         //     case "type4":
        //         //         return "2"
        //         // }
        //     }
        // }









        // if(max_count<=2 && type_sum<=8){
        //     return '9'
        // }
        // else if(count.type1==count.type2==count.type3==count.type4==2){
        //     return '10'
        // }
        // else{
        //     if(max_count<=3){
        //         switch(max_type){
        //             case 'type1':
        //                 return '8'
        //             case 'type2':
        //                 return '4'
        //             case 'type3':
        //                 return '6'
        //             case 'type4':
        //                 return '2'
        //         }
        //     }
        //     else{
        //         switch(max_type){
        //             case 'type1':
        //                 return '7'
        //             case 'type2':
        //                 return '3'
        //             case 'type3':
        //                 return '5'
        //             case 'type4':
        //                 return '1'
        //         }
        //     }
        // }
    }

    * getinitdata(req){
        let user_id = req.query.uid
        let select_crm_user = "select user_sex,user_job from crm_user where user_id=?"
        let result = yield this._daoModel.query(select_crm_user, user_id)
        let query_json_result = result.rows[0]
        let info_is_complete = false
        let sql = "select id,job_name from crm_user_job ";
        let jobs = yield this._daoModel.getYhq(sql);
        if (!query_json_result) {
            return {
                code: '404',
                data: {}
            }
        }
        else {
            
            if ((query_json_result.user_sex==0 || query_json_result.user_sex==1) && query_json_result.user_job) {
                info_is_complete = true                
            }
            return { code: 200, data: { info_is_complete:info_is_complete ,user_job:query_json_result.user_job,user_sex:query_json_result.user_sex ,jobs:jobs.rows},message:'success' }
        }
    }

    *getgamerule(req){
        let activity_id = req.query.activity_id
        let sql = `select activity_topic,rule from crm_game_rule left join act_activity on crm_game_rule.activity_id=act_activity.activity_id where crm_game_rule.activity_id='${activity_id}'`;
        let result = yield this._daoModel.query(sql);
        console.log("fashdkfhjakshdfkjhsjkdfhkhsdjfas")
        console.log(result.rows)
        if (result.rows.length>0) {
            return {code:200,data:result.rows,message:'success'}
        } else {
            return {code:404,data:result.rows,message:'fail'}
        }

    }

}
exports = module.exports = OrderController;