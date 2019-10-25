(function ($) {

    $.endsWith =function(str,suffix){
        return (str.substr(str.length - suffix.length) === suffix);
    }

    $.startWith=function(str,prefix){
        return (str.substr(0, prefix.length) === prefix);
    }
    $.removeStartPrefix=function(prefix,str){
        if ($.startWith(str,prefix)) str.substr(1);
        return str;
    }
    $.removeEndSuffix=function(suffix,str){
        if ($.endsWith(str,suffix)) str.substr(0,str.length-1);
        return str;
    }
    ///判断字符串为空
    $.isNullOrEmpty = function (str) {
        if (typeof (str) == "undefined" || str == null || str == '' || str == 'undefined') return true;
        return false;
    }
    $.checkValue = function(str,defaultValue){
        if ($.isNullOrEmpty(str)){
            return defaultValue?defaultValue:str;
        }
        return str;
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
    $.formatMoney = function (number,prefix) {
        if (isNaN(number)) return number;
        var retValue = number;
        if (!prefix) prefix='￥';
        if ($.isNullOrEmpty(number)) return retValue = 0;
        return prefix+retValue.toFixed(2);
    }
    $.formatDate = function (datetime,fmt) { //author: meizz 
            var o = {
                "M+": datetime.getMonth() + 1, //月份 
                "d+": datetime.getDate(), //日 
                "h+": datetime.getHours(), //小时 
                "m+": datetime.getMinutes(), //分 
                "s+": datetime.getSeconds(), //秒 
                "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度 
                "S": datetime.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
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
    $.downloadByLink=function(url){
        //var link = document.createElement("a");
        var id='downloadLink'+Math.ceil(Math.random() * 1000000);
        $("body").append('<a id="' + id + '" style="display:none" href="'+url+'"><p>download</p><a>');
        $('#'+id+'>p').trigger('click') ;
        $('#'+id).remove();
        
    }
    $.formData2Json = function(formData){
         formData= decodeURIComponent(formData,true);
        formData=formData.replace(/&/g,"\",\"");  
        formData=formData.replace(/=/g,"\":\"");  
        formData="{\""+formData+"\"}";  
        return JSON.parse(formData);  
    }
    $.download = function (url, data, method) {
        // 获取url和data
        if (url && data) {
            // data 是 string 或者 array/object
            data = typeof data == 'string' ? data : decodeURIComponent($.param(data));
            // 把参数组装成 form的  input
            var inputs = '';
            //alert(data);
            $.each(data.split('&'), function () {
                var pair = this.split('=');
                inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
            });
            // request发送请求
            $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
        };
    };
    $.setImage = function(imageControl,imagePath){
        if (!$.isNullOrEmpty(imagePath)) $('#'+imageControl).attr('src', urlConfig.base.imageBase +imagePath);
    };
    $.copytext =function(txt) {
       var textArea = document.createElement("textarea");
        textArea.value = txt;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            if (successful)
                $.messager.show({title:'复制成功',msg:'内容已复制',timeout:2000,showType:'slide'});
            else
                window.prompt("复制: Ctrl+C, Enter", txt);
            // var msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Copying text command was ' + msg);
        } catch (err) {
            window.prompt("复制: Ctrl+C, Enter", txt);
            //console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    }
})(jQuery);


