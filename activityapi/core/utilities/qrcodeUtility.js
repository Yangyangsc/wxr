var fs = require("fs");
var path = require("path");
var qrcode = require('qr-image');
var fileBase = require("./fileBase");
var moment = require('moment');
var config = require('../../configuration.json');

const defaultPath = "public" + path.sep + "qrcode" + path.sep;

class QRCode {
    static saveQRImg(qrtext, filename, { type = 'png', size = 5, margin = 4 } = {}) {
        return new Promise(function (resolve, reject) {
            let imgpath = (config.appsetting.QRImgRelative ? config.appsetting.QRImgRelative : defaultPath) + moment().format('YYYYMMDD') + path.sep + filename;
            let imgresolve = config.appsetting.QRImgSaveDir ? config.appsetting.QRImgSaveDir + imgpath : path.resolve(imgpath);
            let imgdir = path.dirname(imgresolve);
            if (!fs.existsSync(imgdir)) {
                if (!fileBase.mkdirsSync(imgdir))
                    reject(new Error("创建文件夹出错！"))
            };
            let qr_png = qrcode.image(qrtext, { type: type, size: size, margin: margin });
            let writeStream = fs.createWriteStream(imgresolve);
            qr_png.pipe(writeStream);
            writeStream.on('close', function () {
                //substring 去除public/字段
                resolve(imgpath.substring(7));
            });
            writeStream.on('error', function (err) {
                reject(err)
            })
        });
    }
};
exports = module.exports = QRCode;