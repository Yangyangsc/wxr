
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser');
var LiteCoder = require('./core/framework');
var authProvider = require('./provider/authoricateProvider');


var app = express();
/*微信相关路由 */
var wechatHandler = require('./routes/wechat');
var wechetMsg = require("./routes/wechatmsg");
var fileUpload = require("./routes/fileupload");

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == "OPTIONS")
        res.status(200).end();
    else
        next();
});

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//加载微信服务路由（如项目不需要，可注释）
app.use('/', wechatHandler);
app.use('/', wechetMsg);
app.use("/", fileUpload);
app.use("/brh", authProvider.checkAuthorization);

app.get("/", function (req, res) {
    res.json({ successed: true });
});


// const qrcodeUtility = require("./core/utilities/qrcodeUtility");
// qrcodeUtility.saveQRImg("123", "123.png").then(function (result) {
//     let hehe = result;
// });

// var hehe = require("./common/message");
// app.get("/sms", function (req, res) {
//     hehe.SMS({ "Mobile": "13824721039", "Content": "您好,liangzai,感谢您购买地表最强门票,请在微信添加并关注\"弯弓在道\"公号取票,活动当日凭电子票签到,期待您的光临" })
//         .then(function (result) {
//             var fsdf = result;
//             res.json(result);
//         }).catch(function (err) {
//             var laldf = err;
//             res.json(err);
//         });
// });


///启动框架
var framework = new LiteCoder(app);

app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({ successed: false, message: err.message });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ successed: false, message: err.message });
});

module.exports = app;
