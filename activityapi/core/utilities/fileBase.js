var fs = require('fs');
var path = require('path');
var moment = require('moment');
var uuid = require('node-uuid');
var utility = require('../utilities/utilities');
class fileBase {
    static getSaveFileName(saveOption, fileName, userInfo = null) {
        let subFolder = '';
        switch (utility.checkValue(saveOption.subFolder, '').toLowerCase()) {
            ///按日建造一个目录
            case 'onebydate': subFolder = moment().format('YYYYMMDD'); break;
            ///按日建造多级目录
            case 'mutilbydate': subFolder = moment().year() + '/' + moment().month() + '/' + moment().day(); break;
            ///用自己的id(当前登录的id)建造目录
            case 'identity': subFolder = userInfo ? userInfo.id : uuid.v4(); break;
        }
        let saveFolder = path.join(saveOption.saveDir, subFolder);
        try {
            let _fileName;
            switch (utility.checkValue(saveOption.fileName, 'keep').toLowerCase()) {
                ///保持和原有文件一致的文件名
                case "keep": _fileName = fileName; break;
                ///随机命名,但后缀必须一致
                case "random": _fileName = uuid.v4() + path.extname(fileName); break;
                ///使用当前账号的id命名
                case "identity": _fileName = (userInfo ? userInfo.id : uuid.v4()) + path.extname(fileName); break;
            }
            return path.join(saveFolder, _fileName);
        } catch (err) {
            return null;
        }
    }
    /*
    创建多级目录
    */
    static mkdirsSync(dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.split(path.sep).forEach(function (dirname) {
                if (!dirname) dirname = "/";
                if (pathtmp)
                    pathtmp = path.join(pathtmp, dirname);
                else
                    pathtmp = dirname;
                if (!fs.existsSync(pathtmp)) {
                    console.info(pathtmp);
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        console.info(true);
                        return false;
                    }
                }
            });
        }
        return true;
    }
}
exports = module.exports = fileBase;