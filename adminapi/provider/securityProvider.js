var User = require('../model/user');
var utility = require('../core/utilities/utilities');
const WEB_METHOD=['GET_','POST_','PUT_','DELETE_'];
class SecurityProvider
{
    /*
    获取系统对当前用户的安全权限设置信息
    */
    static getSecurityForUser(userUid)
    {
        var user = new User();
        return user.getSecuritiesSetting(userUid);
    }

    /*
    合并同类项：将具有相同的安全权限Url进行合并
    调用权限 ： 禁止最高
    过滤条件 ： 无过滤优先级最高，否则将SQL拼装
    禁用控件、非可视控件 : 合并控件集合
    */
    static combineSecurities(securityItems,userObject){
        return new Promise((resolve,reject)=>{
            var combinedResult={};
            securityItems.forEach(item=>{
                if (item.call_able & 0x02==0) return;
                let securityKey = WEB_METHOD[item.obj_method]+item.obj_url;
                var existedItem =  combinedResult[securityKey];
                if (existedItem)
                {
                    if (existedItem.access & 0x01>0) return;
                    
                    existedItem.access|=item.call_able;
                    if (!existedItem.noFilter)
                    {
                        if (item.filter_type==3)
                            existedItem.noFilter = true;
                        else
                            existedItem.filterSyntax = existedItem.filterSyntax + SecurityProvider.generateFilterSyntax(item.filter_type,userObject,item.custom_filter,true);
                    }
                    existedItem.disableControl=existedItem.disableControl.concat(utility.checkValue(item.disabled_control,'').split(','));
                    existedItem.unvisibleControl=existedItem.unvisibleControl.concat(utility.checkValue(item.unvisibled_control,'').split(','));
                }
                else
                {
                    existedItem={};
                    existedItem.access=item.call_able;
                    existedItem.noFilter = item.filter_type==3;
                    existedItem.filterSyntax=SecurityProvider.generateFilterSyntax(item.filter_type,userObject,item.custom_filter);
                    existedItem.disableControl =utility.checkValue(item.disabled_control,'').split(',');
                    existedItem.unvisibleControl =utility.checkValue(item.unvisibled_control,'').split(',');
                }
                combinedResult[securityKey] = existedItem;
            });
            resolve(combinedResult);
        }
        )
    }
    /*
    根据安全设置的数据过滤类型，生成标准的过滤SQL 语法
    */
    static generateFilterSyntax(filterType,userObject,customFilter,withOr=false)
    {
        switch(filterType)
        {
            ////仅显示自己的数据
            case 0: return (withOr?' OR ':'')+'#MAINTABLE#.rec_creator=\''+userObject.id+'\'';
            ////显示本部门的数据
            case 1: return (withOr?' OR ':'')+'#MAINTABLE#.rec_creator in (select user_id from fw_user where rec_isdeleted=0 and dept_id=\''+userObject.deptid+'\')';
            case 2: return (withOr?' OR ':'')+customFilter;
        }
        return null;
    }
}

exports =module.exports = SecurityProvider;