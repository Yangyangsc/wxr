var utility = require('./utilities');
var stringUtility = require('./stringUtility');
var dataconfig = require('../configuration/dataconfig');
var mysql = require('mysql');
var keyParse = require('./KeywordParse');
class RequestParser {
    /*
    * 根据对应列表的配置(dataConfig.list.search),从请求上下文中获取用户进行搜索的参数信息
    */
    static getSearchCondition(option) {
        let paraCopy = option || {};
        if (paraCopy.request == null) return "";
        if (paraCopy.refer == null && typeof (paraCopy.refer) != "Array") return "";
        if (paraCopy.valueFrom == null) paraCopy.valueFrom = "all";
        var request = paraCopy.request;
        let retSearch = "";
        paraCopy.refer.forEach(element=> {
            retSearch = retSearch+RequestParser.parseAndReplaceSql(request, element.pattern,false);
        });
        return retSearch;
    }
    /*
    解析sql字符串中特殊的占位符
    */
    static parseAndReplaceSql(req,sql,allowNull=true)
    {
        if (utility.isNullOrEmpty(sql)) return '';
        ///定义正则准备查找sql中的特定关键字
        var matched=sql.match(/@.*?@/g);
        if (!matched || matched.length<=0) return sql;
        var parseKeyWordIsNull = false;
        matched.forEach(ele=>{
            var keyValue =utility.checkValue(keyParse.parseKeyValue(req,ele.substring(1,ele.length-1)),'');
            if(keyValue=='') parseKeyWordIsNull = true;
            sql=sql.replace(ele,keyValue);
        });
        if (!allowNull && parseKeyWordIsNull) return '';
        return sql;
    }

    /*
    * 列表请求上下文中获取需要的信息
    * 如Page ,PageSize , Sort 等等
    */
    static getListInfo(req,cfgType=0) {
        let dataKey = utility.checkValue(req.dataKey, req.query.datakey);
        ///确认是否是需要导出Excel
        let export2Excel =utility.checkValue(req.query.exportexcel,"false").toLowerCase()==="true";
        req.page = utility.checkValue((req.body.page == null ? req.query.page : req.body.page), 1);
        req.pageSize = utility.checkValue((req.body.rows == null ? req.query.rows : req.body.rows), 20);
        req.sort = utility.checkValue((req.body.sort == null ? req.query.sort : req.body.sort), "");
        if (req.sort.length>0)
            req.order = utility.checkValue((req.body.order == null ? req.query.order : req.body.order), "");
        else
            req.order ="";

        if (dataKey) {
            req.dataConfig = dataconfig.getConfig(dataKey,cfgType);
            if (req.dataConfig && req.dataConfig.list) {
                req.sqltype = req.dataConfig.list.sqltype || 'sql';
                req.fieldsMapping = req.dataConfig.list.field;
                req.footerMapping = req.dataConfig.list.footer;
                ///将客户端传上来的排序字段映射为数据库的真实字段
                if (req.sort.length>0 && req.fieldsMapping!=null && req.fieldsMapping.length>0)
                {
                    for(let itemIndex=0;itemIndex<req.fieldsMapping.length;itemIndex++)
                    {
                        var field = req.fieldsMapping[itemIndex];
                        if (field.mapping==req.sort || (utility.isNullOrEmpty(field.mapping) && field.name==req.sort)){
                            req.sort = field.name;
                            break;
                        }
                    }
                }
                switch (req.sqltype) {
                    case 'sql':
                        req.searchCondition = module.exports.getSearchCondition({ request: req, refer: req.dataConfig.list.search });
                        req.sort = utility.checkValue(req.sort, req.dataConfig.list.sort);
                        ///客户端调用时是否传递一些 特殊的过滤方式
                        var clientFilter = RequestParser.parseAndReplaceSql(req,req.query.clientFilter);
                        req.listSql =RequestParser.parseAndReplaceSql(req,req.dataConfig.list.sql) + 
                                     ' ' + req.searchCondition + clientFilter +
                                    (utility.isNullOrEmpty(req.sort) ? '' : (' order by ' + (req.sort+' '+req.order))) +
                                    (export2Excel?'':' limit ' + req.pageSize + ' OFFSET ' + (req.page - 1) * req.pageSize) +
                                     /////在Sql中再放入获取总记录数的语句
                                    ';SELECT FOUND_ROWS() AS total;';
                        if (!utility.isNullOrEmpty(req.dataConfig.list.countsql)){
                            req.countSql = RequestParser.parseAndReplaceSql(req,req.dataConfig.list.countsql)+' ' + req.searchCondition;
                            req.listSql+=req.countSql +';';
                        }
                        break;
                    case 'proc':
                        req.listSql = 'call ' + req.dataConfig.list.sql;
                        let search = req.dataConfig.list.search;
                        req.sqlParams = [];
                        req.sqlOutParams = [];
                        if (search == null && typeof (serach) != "Array") {
                            req.listSql += '()';
                        } else {
                            let procParams = '';
                            search.forEach(function (item, index) {
                                if (item.paramType == 'out') {
                                    procParams += '@' + item.key + ',';
                                    req.sqlOutParams.push(item.key);
                                } else {
                                    procParams += '?,';
                                    req.sqlParams.push(utility.getParam(req, item.key, ''));
                                }
                            });
                            req.listSql += "(" + procParams.substring(0, procParams.length - 1) + ")";
                        }
                        break
                }
            }
        }
    }
    /*
    * 详细页面请求上下文中获取需要的信息
    * 如Page ,PageSize , Sort 等等
    */
    static getDetailInfo(req) {
        let dataKey = utility.checkValue(req.dataKey, req.query.datakey);
        if (dataKey) {
            req.dataConfig = dataconfig.getConfig(dataKey);
            if (req.dataConfig && req.dataConfig.detail) {
                ///主键存储
                req.primary=req.dataConfig.detail.primary;
                req.fieldsMapping = req.dataConfig.detail.field;
            }
        }
    }
}

exports = module.exports = RequestParser;