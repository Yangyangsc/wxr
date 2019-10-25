
var apiBase = 'http://webapi.huanxinkeji.cn';

// 获取地址参数, 参数可以是中文也可以是英文
function getUrlParam(key) {
  var url = window.location.search;
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  var result = url.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
}



// 错误提示框
var flag = true;
function Prompt(name, text) {
  if (flag) {
    flag = false;
    $(name).text(text);
    $(name).fadeIn('normal', function() {
      flag = true;
    });
    setTimeout(function() {
      $(name).fadeOut('normal', function() {
        flag = true;
      });
    }, 1500);
  }
}