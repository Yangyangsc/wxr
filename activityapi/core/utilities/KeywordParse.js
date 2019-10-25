var utility = require('./utilities');
var uuid = require('node-uuid'); 
class KeywordParse
{
    /*
    * 从上下文 解析关键字
    * 或者已固定的方式解析关键字
    */
    static parseKeyValue(req,str) {
        if (utility.isNullOrEmpty(str)) return str;
        var strItems = str.split('.');
        if (strItems.length==1)
        {
            switch(str.toLowerCase()){
                case "userid()": 
                    if (req.user && req.user.id) return req.user.id;
                    return uuid.v4(); //return req.session.user.id; 
                case "uuid()" : return uuid.v4();
                case "now()": return utility.now('yyyy-mm-dd hh:MM:ss');
                case "null()": return null;
                default: return (req.body && req.body[str])||(req.query && req.query[str]);
            }
        }
        else
        {
            var collection;
            if (strItems[0]=="" || strItems[1]=="") return str;
            switch(strItems[0].toLowerCase())
            {
                case "query" : collection = req.query; break;
                case "form": collection = req.body;break;
                case "params": collection = req.params; break;
                case "value": return strItems[1];
                default: collection = req.body; break;
            }
            if (collection) return collection[strItems[1]];
            return '';
        }
    }
}
exports = module.exports=KeywordParse;