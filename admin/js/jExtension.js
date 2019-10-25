(function ($) {
    $.endsWith =function(str,suffix){
        return (str.substr(str.length - suffix.length) === suffix);
    }

    $.startWith=function(str,prefix){
        return (str.substr(0, prefix.length) === prefix);
    }
    ///判断字符串为空
    $.isNullOrEmpty = function (str) {
        if (typeof (str) == "undefined" || str == null || str == '' || str == 'undefined') return true;
        return false;
    }
    ///在字符串中找另一个字符串
    $.findStrInStr = function (str, findStr, isCase) {
        if (typeof (findStr) == 'number') {
            return str.indexOf(findStr);
        }
        else {
            var re = new RegExp(findStr, isCase ? 'i' : '');
            var r = str.match(re);
            return r == null ? -1 : r.index;
        }
    }
    $.formatMoney = function (number) {
        var retValue = number;
        if ($.isNullOrEmpty(number)) return retValue = 0;
        return retValue.toFixed(2);
    }
    ///从Url中获取参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name.toLowerCase() + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).toLowerCase().match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    ///重定向
    $.redirect = function (newUrl) {
        window.location.href = newUrl;
    }
    $.getFilename = function (fullpath) {
        var filename = fullpath.replace(/.*(\/|\\)/, "");
        //var fileExt = (/[.]/.exec(fullpath)) ? /[^.]+$/.exec(fullpath.toLowerCase()) : '';
        return filename;
    }
    
})(Zepto);


