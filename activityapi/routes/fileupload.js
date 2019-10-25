var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var path = require('path');
var config = require('../core/configuration/frameworkConfig');
var utility = require('../core/utilities/utilities');
var stringUtility = require('../core/utilities/stringUtility');
var uploadConfig = require('../uploadconfig.json');
var fileUtility = require('../core/utilities/fileUtility');
var aLiYunOSSUtility = require('../core/utilities/aLiYunOSSUtility');
var apiResult = require('../core/result/actionResult');
var userInfo = null, fileType;
var uuid=require('node-uuid');
var co=require('co');
const FILE_RESULT = { SUCCESSED: 0, BEFORE_CANCEL: 1, SAVE_FAILD: 2, AFTER_CANCEL: 3 };
router.post('/fileupload/:filetype',function (req, res, next) {
    fileType = req.params.filetype;
    var fileSetting = uploadConfig[fileType];
    if (!fileSetting) {
        res.json({ successed: false, errmessage: "no configuration for such file" });
        return;
    }

    var form = new multiparty.Form();
    ////配置文件中的文件上传保存在本地服务器或是OSS
    form.savelocal = config.getSetting('savelocal', true);

    //* 前置处理,用不同的处理器来处理
    if (!utility.isNullOrEmpty(fileSetting.handler) &&
        fs.existsSync(fileSetting.handler.split(',')[1])) {
        form.cusProcess = require(fileSetting.handler.split(',')[0]);
    }

    form.formFileds = {};
    form.fileResult = [];

    form.on('error', function (err) {
        console.log('parse error: ' + err);
        res.json({ successed: false, errmessage: "Error parsing form." });
    });

    form.on('field', function (name, value) {
        this.formFileds[name] = value;
    });

    form.on('part', function (part) {
        if (part.filename) {
            part.dealResult = {id:uuid.v4() , name: part.name, filename: part.filename,filesize:part.byteCount };
            console.log('deal file name: ' + part.name);
            if (this.cusProcess != null && typeof (this.cusProcess.beforeUpload) === "function") {
                let processData = this.cusProcess.beforeUpload(fileType, part,this.formFileds, userInfo);
                ///可能取消上传了
                if (!processData.successed) {
                    part.dealResult["result"] = FILE_RESULT.BEFORE_CANCEL;
                    this.fileResult.push(part.dealResult);
                    return part.resume();
                }
            }

            // 保存处理
            if (this.savelocal) {
                fileUtility.save2LocalForStream(part.filename, part, fileSetting, userInfo, affterSave.bind(this));
            } else {
                this.flushing++;
                aLiYunOSSUtility.uploadForStream(part.filename, part, fileSetting, userInfo, affterSave.bind(this));
            }
        }
        part.on('error', function (err) {
            console.log('file part err: ' + err.stack);
        });
    });

    form.on('close', function () {
        console.log('file upload closed');
        res.json(this.fileResult);
    });

    form.parse(req);
});

function affterSave(part, saveResult) {
        if (this.savelocal) {
            part.resume();
        } else {
            part.emit('end');
        }
        if (saveResult.successed) {
            part.dealResult["result"] = FILE_RESULT.SUCCESSED;
            part.dealResult["path"] =saveResult.filePath;//utility.replace(saveResult.filePath,"\\","//");
        } else {
            part.dealResult["result"] = FILE_RESULT.SAVE_FAILD;
        }
        this.fileResult.push(part.dealResult);
        ////上传执行后处理
        if (this.cusProcess != null && typeof (this.cusProcess.afterUpload) === "function") {
            //let processData = 
            co(this.cusProcess.afterUpload(fileType, part,this.formFileds, userInfo))
                .then(result=>this.fileResult.push(part.dealResult))
                .catch(result=>part.dealResult["result"] = FILE_RESULT.AFTER_CANCEL)
        }
        // else
        //     this.fileResult.push(part.dealResult);
}
module.exports = router;