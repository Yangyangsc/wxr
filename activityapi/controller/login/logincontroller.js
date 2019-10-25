var co = require('co');
var memberDao = require('../../model/member/member');
var controllerBase = require('../../core/controllerBase');
var UUID = require('node-uuid');
var crypto = require('crypto')



class LoginController extends controllerBase {
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
        //#获取详细记录的路由配置
        // 入会填写资料获取信息
        this.app.post('/login', function (req, res) {
            var code = req.body.code
            if(!code ||code!=="8888"){
                return res.json({successed:false,message:"验证码错误"})
            }
            var user_mobile = req.body.user_mobile
            var login_select_sql = 'select user_id from crm_user where user_mobile='+user_mobile
            co(instance._daoModel.loadData(login_select_sql))
                .then(result => instance.verify_login(instance, result,req,res))
                
        });
    }

    verify_login(instance, result,req,res){
        var result_rows = JSON.parse(JSON.stringify(result.rows))[0]
        var user_id = 0
        if (!result_rows){                                         // 数据库里面没有该手机的记录就进行注册
            var user_mobile = req.body.user_mobile
            var user_name = user_mobile
            var user_id = UUID.v1();
            var user_sex = '1'
            var user_create_date = new Date().toISOString().replace('T',' ').split('.')[0]
            var user_serial = 0
            co(instance._daoModel.loadData("select fun_GetSerial()"))
                .then(result =>{
                    user_serial = JSON.parse(JSON.stringify(result.rows))[0]['fun_GetSerial()']
                    console.log(user_id,user_name,user_sex,user_create_date,user_serial)
                    var inser_crm_user = "insert into crm_user (user_id,user_name,user_sex,user_create_date,user_serial,user_mobile) values ("+"'"+user_id+"'"+","+"'"+user_name+"'"+","+user_sex+","+"'"+user_create_date+"'"+","+"'"+user_serial+"'"+","+"'"+user_mobile+"'"+')'
                    co(instance._daoModel.loadData(inser_crm_user))
                        .then(res.json({successed:true,user_id:user_id}))
                })            
               
        }
        else{
            user_id = result_rows['user_id']
            res.json({successed:true,user_id:user_id})
            }
        }
      

};

exports = module.exports = LoginController;