const co = require('co');
const activityDao = require('../../model/act/activity');
const controllerBase = require('../../core/controllerBase');
const errEnum = require("../../common/enum");
const validator = require("validator");
// const oredercontroller = require('ordercontroller')
class ActivityController extends controllerBase {
    /*
    * 类构造函数
    * 设置类需要的数据实体操作实例
    */
    constructor(application) {
        ///将对应的数据库实体对象传递至基类
        super(application, new activityDao());
    }

    initializeRouter(instance) {
        //#获取详细记录的路由配置
        this.app.get('/activitys/:id', function (req, res) {
            co(instance.getActivityDetal(req))
                .then(result => instance.responseResult(req, res, result))
                .catch(result => { console.log(result); instance.responseResult(req, res, result); });
        });


        //#获取详细记录的路由配置


        this.app.get('/activitys', function (req, res) {
            let cateid = req.query.cateid || "";
            instance._daoModel.getActivityList(cateid)
                .then(function (result) {
                    if (result.rows != null && result.rows.length == 2) {
                        return res.json({ successed: true, rows: result.rows[0] });
                    } else {
                        return res.json({ successed: false, message: "获取数据失败！" });
                    }
                })
                .catch(function (err) {
                    return res.json({ successed: false, message: "获取数据失败！" });
                });
        });
    }

    *getActivityDetal(req) {
        console.log("hdfjkahskjdhfkahskdfhkjashdf");
        console.log(req.session)
        let activityid = req.params.id;
        let sharer = req.query.userid;     // 分享者的uid
        console.log(sharer);
        if (!validator.isUUID(activityid)) return { successed: false, error: 1014, message: errEnum.RESULT_ERROR_ENUM[1014] };
        let channelid = req.query.cid || "";
        let giftid = req.query.gid || "";
        // let openid = req.query.uid || "";
        let userid = req.query.userid || "";
        
        let result = yield this._daoModel.getDetialById([activityid, channelid, giftid, userid]);

        console.log(result);

        if (result.rows != null && result.rows.length >= 3 && result.rows[0].length > 0) {
            result.rows[0][0].ticket = result.rows[1];
            var temp=new Array();
            var count=0;
            if(result.rows[2][0].activity_cover){
                temp[count]={"img":result.rows[2][0].activity_cover};
                count++;
            }
            if(result.rows[2][0].img1){
                temp[count]={"img":result.rows[2][0].img1};
                count++;
            }
            if(result.rows[2][0].img2){
                temp[count]={"img":result.rows[2][0].img2};
                count++;
            }
            if(result.rows[2][0].img3){
                temp[count]={"img":result.rows[2][0].img3};
                count++;
            }
            if(result.rows[2][0].img4){
                temp[count]={"img":result.rows[2][0].img4};
                count++;
            }
            if(result.rows[2][0].img5){
                temp[count]={"img":result.rows[2][0].img5};
                count++;
            }
            result.rows[0][0].imgs = temp;
            // result.rows[0][0].imgs = result.rows[2];
            // console.log("----------->"+result.rows[2][0].activity_cover);
            let outputData = { successed: true, rows: result.rows[0] };
            return outputData;
        }
    }


}
exports = module.exports = ActivityController;