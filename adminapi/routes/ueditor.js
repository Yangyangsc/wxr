var ueditor = require('../core/utilities/ueditorUtility');
var uploadConfig = require('../uploadconfig.json');
var config = require("../configuration.json");
var fileUtility = require('../core/utilities/fileUtility');
var aLiYunOSSUtility = require('../core/utilities/aLiYunOSSUtility');
var express = require('express');
var path = require('path');
var ueditorConfig = JSON.stringify(require("../config/ueditor/config.json"));
var router = express.Router();

router.all("/ueditor/ue", ueditor(path.resolve(), function (req, res, next) {
    //客户端上传文件设置
    let fileSetting, savelocal = config.appsetting.savelocal;
    let ActionType = req.query.action;

    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        // var file_url = 'ueditor/images/';//默认图片上传地址
        /*其他上传格式的地址*/
        switch (ActionType) {
            case "uploadfile":
                fileSetting = uploadConfig["htmlinnerfile"];
                break;
            case "uploadvideo":
                fileSetting = uploadConfig["htmlinnervideo"];
                break;
            default:
                fileSetting = uploadConfig["htmlinnerimage"];
                break;
        }
        let saveHandler = savelocal ? fileUtility.save2LocalForStream : aLiYunOSSUtility.uploadForStream;
        res.ue_up(fileSetting, saveHandler, null); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    else if (req.query.action == "catchimage") {
        res.catch_img(uploadConfig["htmlinnercatch"], fileUtility.save2localForRemoteImage, null);
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        if (req.query.callback) {
            res.setHeader('Content-Type', 'application/javascript');
            res.send(req.query.callback + "(" + ueditorConfig + ")");
        }
        else {
            res.setHeader('Content-Type', 'text/plain');
            res.send(ueditorConfig);
        }
    }
}));


module.exports = router;


