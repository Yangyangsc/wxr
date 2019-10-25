var Busboy = require('busboy');
var fs = require('fs');

var ueditor = function (static_url, handel) {
    return function (req, res, next) {
        var _respond = respond(static_url, handel);
        _respond(req, res, next);
    };
};
var respond = function (static_url, callback) {
    return function (req, res, next) {
        if (req.query.action === 'config') {
            callback(req, res, next);
            return;
        } else if (req.query.action === 'listimage') {
            res.ue_list = function (list_dir) {
                var str = '';
                var i = 0;
                var list = [];
                fs.readdir(static_url + list_dir, function (err, files) {
                    if (err) throw err;

                    var total = files.length;
                    files.forEach(function (file) {

                        var filetype = 'jpg,png,gif,ico,bmp';
                        var tmplist = file.split('.');
                        var _filetype = tmplist[tmplist.length - 1];
                        if (filetype.indexOf(_filetype.toLowerCase()) >= 0) {
                            var temp = {};
                            if (list_dir === '/') {
                                temp.url = list_dir + file;
                            } else {
                                temp.url = list_dir + "/" + file;
                            }
                            list[i] = (temp);
                        } else { }
                        i++;
                        // send file name string when all files was processed
                        if (i === total) {
                            res.json({
                                "state": "SUCCESS",
                                "list": list,
                                "start": 1,
                                "total": total
                            });
                        }
                    });
                });
            };
            callback(req, res, next);

        } else if (req.query.action === 'uploadimage' || req.query.action === 'uploadfile' || req.query.action === 'uploadvideo') {
            var busboy = new Busboy({
                headers: req.headers
            });
            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                req.ueditor = {};
                req.ueditor.fieldname = fieldname;
                req.ueditor.file = file;
                req.ueditor.filename = filename;
                req.ueditor.encoding = encoding;
                req.ueditor.mimetype = mimetype;
                res.ue_up = function (fileSetting, saveHandler, userinfo = null) {
                    saveHandler(filename, file, fileSetting, userinfo, function (file, result) {
                        res.json({
                            'url': result.filePath,
                            'title': req.body.pictitle,
                            'original': filename,
                            'state': 'SUCCESS'
                        });
                    });
                };
                callback(req, res, next);
            });
            req.pipe(busboy);
        } else if (req.query.action = "catchimage") {
            var urlArr = req.query.source;
            if (!urlArr || !(urlArr instanceof Array) || urlArr.length == 0) return res.json({ state: "参数错误：没有指定抓取源" })
            res.catch_img = function (fileSetting, saveHandler, userinfo = null) {
                saveHandler(urlArr, fileSetting, userinfo, function (err, result) {
                    if (err) return res.json({ state: err.message });
                    if (req.query.callback) {
                        res.setHeader('Content-Type', 'application/javascript');
                        res.send(req.query.callback + "(" + JSON.stringify({ state: "SUCCESS", list: result }) + ")");
                    } else {
                        res.setHeader('Content-Type', 'text/plain');
                        res.send(JSON.stringify({ state: "SUCCESS", list: result }));
                    }
                });
            };
            callback(req, res, next);
        }
        else {
            callback(req, res, next);
        }
        return;
    };
};
module.exports = ueditor;