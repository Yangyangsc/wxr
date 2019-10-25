var co = require('co');
var OSS = require('ali-oss');
var fs = require('fs');
var fileBase = require('./fileBase');
var settingjson = require("../../configuration.json");
var utility = require('./utilities');
var client = new OSS(settingjson.aliYunOSS);
class aLiYunOSSUtility extends fileBase {
    /**
     * saveOption:长传文件类型配置
     * data：上传本地文件的路径或者是上传的Buffer
     */
    static upload(fileName, saveOption, data, userInfo, callback) {
        var destinationFileName = super.getSaveFileName(saveOption, fileName, userInfo);
        co(function* () {
            var result = yield client.put(destinationFileName, data);
            if (utility.isFunction(callback)) {
                callback(file, { success: true, filePath: result.name });
            }
        }).catch(function (err) {
            if (utility.isFunction(callback)) {
                callback(file, { success: false });
            }
        });
    }

    static uploadForStream(fileName, file, saveOption, userInfo, callback) {
        var destinationFileName = super.getSaveFileName(saveOption, fileName, userInfo);
        destinationFileName = destinationFileName.replace(/\\/g, "/");
        co(function* () {
            var result = yield client.putStream(destinationFileName, file);
            if (utility.isFunction(callback)) {
                callback(file, { success: true, filePath: result.name });
            }
            // console.log(result);
        }).catch(function (err) {
            if (utility.isFunction(callback)) {
                callback(file, { success: false });
            }
        });
    }

    static saveFileForStr(filePath, strData) {
        return co(function* () {
            var result = yield client.put(filePath, new Buffer(strData));
        });
    }
}
exports = module.exports = aLiYunOSSUtility;