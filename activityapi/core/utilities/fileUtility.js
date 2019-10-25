var fs = require('fs');
var path = require('path');
var moment = require('moment');
var uuid = require('node-uuid');
var utility = require('../utilities/utilities');
var fileBase = require('./fileBase');
var request = require('request');
const config = require("../../configuration.json");

const LOCAL_UPLOAD_BASE_DIR = "./public/"
class fileUtility extends fileBase {
    /**
     * file 文件流
     * saveOption 保存配置
     * userInfo 用户信息
     * callback 回调函数
     */
    static save2LocalForStream(fileName, file, saveOption, userInfo, callback) {
        let destinationFileName = super.getSaveFileName(saveOption, fileName, userInfo);
        if (destinationFileName == null) return { successed: false };
        let fullFileName = saveOption.rootDir ? path.join(saveOption.rootDir, destinationFileName) : path.resolve(LOCAL_UPLOAD_BASE_DIR, destinationFileName);
        let _saveDir = path.dirname(fullFileName);
        ///创建本地文件夹
        if (!fs.existsSync(_saveDir)) {
            if (!super.mkdirsSync(_saveDir) && utility.isFunction(callback)) {
                callback(file, { successed: false });
            }
        };
        file.pipe(fs.createWriteStream(fullFileName));
        if (utility.isFunction(callback)) {
            callback(file, { successed: true, filePath: destinationFileName });
        }
    }

    ///保存文件至本地
    static save2Local(fileObject, saveOption, userInfo = null) {
        var destinationFileName = super.getSaveFileName(saveOption, fileObject.originalFilename, userInfo);
        if (destinationFileName == null) return { successed: false };
        destinationFileName = path.resolve(LOCAL_UPLOAD_BASE_DIR, destinationFileName);
        let _saveDir = path.dirname(destinationFileName);
        ///创建本地文件夹
        if (!fs.existsSync(_saveDir)) { if (!fileBase.mkdirsSync(_saveDir)) return { successed: false } };
        ///将上传的临时文件转移至最终目录
        fs.renameSync(fileObject.path, destinationFileName);
        return { successed: true, path: path.join(saveOption.saveDir, subFolder, path.basename(destinationFileName)) };
    }

    static saveStr2Local(filePath, data) {
        return new Promise(function (resolve, reject) {
            let savePath = path.join(LOCAL_UPLOAD_BASE_DIR, filePath);
            let dirPath = path.dirname(savePath);
            if (!fs.existsSync(dirPath)) {
                if (!fileBase.mkdirsSync(dirPath)) {
                    return reject(new Error("创建文件夹错误"));
                }
            }
            fs.writeFile(savePath, data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ successed: true });
                }
            })
        });
    }

    static save2localForRemoteImage(sourceUrl, filePath) {
        return new Promise(function (resolve, reject) {
            let fullFileName = config.writeFileRootFolder ? config.writeFileRootFolder + filePath : path.resolve(LOCAL_UPLOAD_BASE_DIR, filePath);
            let _saveDir = path.dirname(fullFileName);
            ///创建本地文件夹
            if (!fs.existsSync(_saveDir)) {
                if (!fileUtility.mkdirsSync(_saveDir)) {
                    return reject(new Error("创建本地文件夹出错！"));
                }
            };
            let writeStream = fs.createWriteStream(fullFileName);
            request.get(sourceUrl)
                .on('error', function (err) {
                    return reject(new Error("获取网络图片出错！"));
                })
                .pipe(writeStream);
            writeStream.on('close', function () {
                resolve({ state: true, source: sourceUrl, url: filePath });
            });
            writeStream.on('error', function (err) {
                reject(new Error("保存网络图片出错！"));
            })
        });
    }
}
exports = module.exports = fileUtility;