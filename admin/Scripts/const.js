if (typeof lmh_const == "undefined") {
    var lmh_const = {};
    ////USER Dictionary CONST
    lmh_const.ARTICLE_PUBLISH_STATUS = ["草稿", "审核中", "审核未发布", "发布"];
    lmh_const.ACTIVITY_STATUS= ["草稿", "发布", "下线"];
    lmh_const.USER_VERIFY_STATUS = ["注册用户", "认证用户", "等待认证"];
    //lmh_const.MEMBER_TYPE = ["非会员","万媒会员", "千媒会员", "百人会员"];
    lmh_const.PAYMENT_TYPE = ["会员会费", "活动费用", "产品/服务购买","活动门票"];
    ////会员类型通过二进制的位 = 1 来确定
    lmh_const.LITECODER_MEMBER =      [{value:0,text:'普通用户'},
                             {value:1,text:'万媒会员'},
                             {value:2,text:'学院会员'},
                             {value:4,text:'千媒会员'},
                             {value:8,text:'百人会员'}
                            ];

    lmh_const.USER_TYPE_COLOR = ["ident-tag status-unident", "ident-tag status-identing", "ident-tag status-idented"];
    lmh_const.USER_TYPE_VERIFY_STATUS = ["请求实名认证", "请求资源认证", "请求资源认证"];
    lmh_const.USER_VERIFY_AUDIT_STATUS = ["等待认证", "认证通过", "认证拒绝"];
    lmh_const.EXPERT_AUDIT_STATUS = ["等待认证", "认证通过", "认证拒绝", "停牌行家"];
    lmh_const.SUGGESTION_TYPE = ["闪退、卡退或界面错位", "功能使用", "产品体验", "资源服务", "其他"];
    lmh_const.SUGGESTION_FROM = ["手机Wap", "App应用", "微应用", "网站"];
    lmh_const.SUGGESTION_PROCESS = ["未处理", "已联系", "已解决"];
    lmh_const.ADVERTISEMENT_POSITION = ["资讯页位置1", "资讯页位置2", "响晒页位置1", "响晒页位置2", "响约页位置1", "响约页位置2", "响吧页位置1", "响吧页位置2"];
    lmh_const.USER_LEVEL = ["铁牌用户", "铜牌用户", "银牌用户", "金牌用户", "钻石用户", "食神级"];
    lmh_const.USER_DISABLE = ["正常", "禁用"];
    lmh_const.USER_ONLINE_STATUS = ["下线", "在线"];

    lmh_const.RECORD_AUDIT = ["提交审核", "审核通过", "审核拒绝"];

    lmh_const.INFORMATION_HOT = ["未知", "原创", "案例", "人物", "群访"];
}

