; (function () {
    // 返回的是对象形式的参数  
    function getUrlArgObject() {
        var args = {}
        var query = typeof window == 'undefined' ? '' : location.search.substring(1); // 获取查询串  
        var pairs = query.split('&'); // 在逗号处断开  
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); // 查找name=value  
            if (pos == -1) { // 如果没有找到就跳过  
                continue
            }
            var argname = pairs[i].substring(0, pos); // 提取name  
            var value = pairs[i].substring(pos + 1); // 提取value  
            args[argname.toLocaleLowerCase()] = decodeURIComponent(value); // 存为属性  
            args[argname.toUpperCase()] = decodeURIComponent(value); // 存为属性  
            args[argname] = decodeURIComponent(value); // 存为属性  
        }
        return args; // 返回对象  
    }
    var queryString = {
        query: getUrlArgObject(),
        replaceParamVal(paramName, replaceWith) {
            var oUrl = this.location.href.toString()
            var re = eval('/(' + paramName + '=)([^&]*)/gi')
            var nUrl = ''
            if (oUrl.indexOf(paramName) == -1) {
                if (oUrl.indexOf('?') == -1) {
                    nUrl = oUrl + '?'
                } else {
                    nUrl = oUrl + '&'
                }
                nUrl += paramName + '=' + replaceWith
            } else {
                oUrl.replace(re, paramName + '=' + replaceWith)
            }

            return nUrl
        }
    }

    var moduleName = queryString
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = moduleName
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () { return moduleName; })
    } else {
        this.moduleName = moduleName
    }
}).call(function () {
    return this || (typeof window !== 'undefined' ? window : global)
})
