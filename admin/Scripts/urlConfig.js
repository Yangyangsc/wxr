var baseUrl = "/";
var webRootUrl = 'http://admin.huanxinkeji.cn';
var staticfilesBase = "http://resources.lanmeihui.com.cn/"; //"/staticfiles/"
var imagefilesBase = "http://image.lanmeihui.com.cn/"; //"/staticfiles/"
var localstaticfilesBase = "http://admin.lanmeihui.com.cn/static/"; //"/staticfiles/"
var apiUrl = "http://adminapi.huanxinkeji.cn";
var urlConfig = {
    base:{
        Root: 'http://admin.huanxinkeji.cn',
        ApiRoot:apiUrl,
        imageBase:'http://image.huanxinkeji.cn/',
        ueditorUrl:'http://adminapi.huanxinkeji.cn/ueditor/ue',
        //activityRoot:'http://activity.huanxinkeji.cn/',
		activityRoot:'http://activity.huanxinkeji.cn/activity/activity-details.html',
        joinUsRoot:'http://activity.huanxinkeji.cn/membership/index.html',
        articlePage:'http://www.huanxinkeji.cn/article.html?id='
    },
    themes:{
        metro:webRootUrl+'/app_themes/metro/easyui.css',
        bootstrap: webRootUrl+'/app_themes/bootstrap/easyui.css',
        blue: webRootUrl+'/app_themes/default/easyui.css',
        green: webRootUrl+'/app_themes/green/easyui.css',
        black: webRootUrl+'/app_themes/black/easyui.css',
        sunny:webRootUrl+'/app_themes/sunny/easyui.css'
    },
    ApiUrl:{
        userApi:{
            List:'/user',
            Add:'/user',
            Update:'/user/',
            Reset:'/user/reset/',
            Disable:'/user/disable/',
            Functions:'/user/function/'
        }
    }
    
}
