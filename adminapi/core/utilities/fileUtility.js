var fs = require('fs');
var path = require('path');
var moment = require('moment');
var uuid = require('node-uuid');
var utility = require('../utilities/utilities');
var fileBase = require('./fileBase');
var request = require('request');
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
        if (destinationFileName == null) return { success: false };
        let fullFileName = path.resolve(LOCAL_UPLOAD_BASE_DIR, destinationFileName);
        let _saveDir = path.dirname(fullFileName);
        ///创建本地文件夹
        if (!fs.existsSync(_saveDir)) {
            if (!super.mkdirsSync(_saveDir) && utility.isFunction(callback)) {
                callback(file, { success: false });
            }
        };
        file.pipe(fs.createWriteStream(fullFileName));
        if (utility.isFunction(callback)) {
            callback(file, { success: true, filePath: destinationFileName });
        }
    }

    static save2localForRemoteImage(sourceUrlArr, saveOption, userInfo, callback) {
        promiseAll(sourceUrlArr, saveOption, userInfo).then(function (values) {
            callback(null, values);
        }).catch(function (err) {
            callback(new Error("抓取报错"));
        });
    }

    ///保存文件至本地
    static save2Local(fileObject, saveOption, userInfo = null) {
        var destinationFileName = super.getSaveFileName(saveOption, fileObject.originalFilename, userInfo);
        if (destinationFileName == null) return { success: false };
        destinationFileName = path.resolve(LOCAL_UPLOAD_BASE_DIR, destinationFileName);
        let _saveDir = path.dirname(destinationFileName);
        ///创建本地文件夹
        if (!fs.existsSync(_saveDir)) { if (!fileBase.mkdirsSync(_saveDir)) return { success: false } };
        ///将上传的临时文件转移至最终目录
        fs.renameSync(fileObject.path, destinationFileName);
        return { success: true, path: path.join(saveOption.saveDir, subFolder, path.basename(destinationFileName)) };
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
                    resolve({ success: true });
                }
            })
        });
    }

}
function promiseAll(urlArr, saveOption, userInfo) {
    let promiseArr = [];
    for (let url of urlArr) {
        try {
            promiseArr.push(
                new Promise(function (resolve, reject) {
                    let destinationFileName = fileUtility.getSaveFileName(saveOption, "flag.png", userInfo);
                    if (destinationFileName == null) return { success: false };
                    let fullFileName = path.resolve(LOCAL_UPLOAD_BASE_DIR, destinationFileName);
                    let _saveDir = path.dirname(fullFileName);
                    ///创建本地文件夹
                    if (!fs.existsSync(_saveDir)) {
                        if (!fileUtility.mkdirsSync(_saveDir) && utility.isFunction(callback)) {
                            callback(file, { success: false });
                        }
                    };
                    let writeStream = fs.createWriteStream(fullFileName);
                    request.get(url)
                        .on('error', function (err) {
                            resolve({ state: err.message, source: url });
                        })
                        .pipe(writeStream);
                    writeStream.on('close', function () {
                        resolve({ state: "SUCCESS", source: url, url: destinationFileName });
                    });
                    writeStream.on('error', function (err) {
                        resolve({ state: err.message, source: url });
                    })
                })
            );
        } catch (error) {
            let hehe = error;
        }

    }
    return Promise.all(promiseArr);
}
exports = module.exports = fileUtility;