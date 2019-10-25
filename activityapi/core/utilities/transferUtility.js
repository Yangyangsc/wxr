var utilities = require('./utilities');
var stringUtility = require('./stringUtility');
var keyParse = require('./KeywordParse');
///值类型转换
class ViewHelper {
    /*
    * 将结果集转换为视图需要的结果
    */
    static transferName2Mapping(originalResult, fieldConfig) {
        return new Promise((success, failed) => {
            if (originalResult == null) return success({ successed: true, data: null });
            if (fieldConfig == undefined || fieldConfig == null || fieldConfig.length == 0) return success({ successed: true, data: originalResult });
            var retResult = [];
            originalResult.forEach(function (row) {
                var item = {};
                fieldConfig.forEach(function (element) {
                    ///如果该字段的序列化仅用于向后保存，则序列化到
                    ///前端页面的时候就不再输出了
                    if (element.direction && element.direction.toLowerCase() == "backonly") return;
                    var rawValue = row[element.name];
                    if (utilities.isNullOrEmpty(rawValue) && !utilities.isNullOrEmpty(element.nullValue)) rawValue = element.nullValue;
                    ///格式化输出
                    if (!utilities.isNullOrEmpty(element.format)) {
                        if (stringUtility.startWith(element.format, '{') && stringUtility.endsWith(element.format, '}'))
                            rawValue = stringUtility.format(element.format, rawValue);
                        else {
                            rawValue = ViewHelper.specialFormatValue(element.format, rawValue);
                        }
                    }
                    if (utilities.isNullOrEmpty(element.mapping))
                        item[element.name] = rawValue;
                    else
                        item[element.mapping] = rawValue;
                });
                retResult.push(item);
            });
            success({ successed: true, data: retResult });
        });


    }
    /*
    * 从请求上下文中获取数值，用于新增或修改
    */
    static transferMapping2Name(req, fieldConfig, doWhat) {
        return new Promise((success) => {
            var model = {};
            if (fieldConfig && Array.isArray(fieldConfig)) {
                fieldConfig.forEach(function (element) {
                    ///如果该字段的序列化仅用于向前端输出，保存时忽略
                    if (element.direction && element.direction.toLowerCase() == "frontonly") return;
                    if (!utilities.isNullOrEmpty(element.action) && element.action.indexOf(doWhat) < 0) return;
                    var bodyKey = utilities.checkValue(element.mapping, element.name);
                    // if (utilities.isNullOrEmpty(element.mapping))
                    //     model[element.name] =keyParse.parseKeyValue(req,element.nullValue);
                    // else
                    {
                        var postValue = req.body[bodyKey];
                        ///如果提交的值为空
                        if (utilities.isNullOrEmpty(postValue)) {
                            if (!utilities.isNullOrEmpty(element.nullValue))
                                postValue = keyParse.parseKeyValue(req, element.nullValue);
                            else
                                postValue = null;
                        }
                        ///格式化结果
                        if (!utilities.isNullOrEmpty(element.format)) {
                            if (stringUtility.startWith(element.format, '{') && stringUtility.endsWith(element.format, '}'))
                                postValue = stringUtility.format(element.format, postValue);
                            else {
                                postValue = ViewHelper.specialFormatValue(element.format, postValue, false);
                            }
                        }

                        model[element.name] = postValue;
                    }
                });
            }
            else
                model = req.body;
            success({ successed: true, data: model });
        });
    }

    static specialFormatValue(format, value, toView = true) {
        let formatItem = format.split('|');
        let coll = {};
        let keyIndex = toView ? 0 : 1
        formatItem.forEach(item => {
            if (item == '') return;
            var itemValues = item.split(':');
            if (itemValues.length != 2) return;
            coll[itemValues[keyIndex]] = itemValues[1 - keyIndex];
        })
        //let jsonFormat =JSON.parse('{'+format+'}');
        return coll[value];
    }

}

exports = module.exports = ViewHelper;