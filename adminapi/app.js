
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var LiteCoder = require('./core/framework');


var app = express();
var fileHandler = require('./routes/fileupload');
/*微信相关路由 */
var wechatHandler = require('./routes/wechat');
/*UEditor富文本编辑器*/
var ueditorHandler = require('./routes/ueditor');

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


// view engine setup
app.set('views', path.join(__dirname, 'views'));
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        section: function (name, option) {
            if (!this._sections) this._sections = {};
            this._sections[name] = option.fn(this);
            return null;
        }
    }
});// 设置默认布局为main 

app.engine('handlebars', handlebars.engine); // 将express模板引擎配置成handlebars 
app.set('view engine', 'handlebars');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'20mb'}));
app.use(bodyParser.urlencoded({limit:'20mb', extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

/*************开启跨域**********/
// var cors = require('cors');
// app.use(cors());


/*************开启认证**********/
/*
app.oauth = oauthserver({
    model: require('./core/oauth2model'), // 绑定验证的接口
    grants: ['password'],               
    debug: true
});
app.all('/oauth/token', app.oauth.grant());
*/


// app.get('/serial', function (req, res) {
//     var captcha = svgCaptcha.create();
//     // req.session.captcha = captcha.text;
//     res.set('Content-Type', 'image/svg+xml');
//     res.status(200).send(captcha.data);
//     // var utility = require('./core/utilities/utilities');
//     // res.json({str1:utility.generateRandomSerial(6,false),
//     //             number1:utility.generateRandomSerial()});
// })
//加载文件上传的服务路由
app.use('/', fileHandler);
//加载微信服务路由（如项目不需要，可注释）
app.use('/', wechatHandler);
//百度富文本编辑的处理路由（如项目不需要，可注释）
app.use('/', ueditorHandler);

//app.get('/', function (req, res) {
//    res.redirect("/index.html");
//});

/**
* test
// app.use('/', function (req, res) {
//     res.render('ueditor');
// });
// var test = require('./core/utilities/aLiYunOSSUtility');
// test.saveFileForStr('test/haha/nima.txt', 'rilegou').then(function (data) {
//     console.log(data);
// }).catch(function (err) {
//     console.log(err);
// });
 */

///启动框架
var framework = new LiteCoder(app, require('./provider/authoricateProvider'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//app.use(app.oauth.errorHandler());
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        return res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    return res.render('error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
