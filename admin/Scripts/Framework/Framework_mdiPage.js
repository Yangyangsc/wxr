// var rootDir = 'http://192.168.0.184:10000'
// var themes = {
//     'metro':rootDir+'/app_themes/metro/easyui.css',
//     'bootstrap': rootDir+'/app_themes/bootstrap/easyui.css',
//     'blue': rootDir+'/app_themes/default/easyui.css',
//     'green': rootDir+'/app_themes/green/easyui.css',
//     'black': rootDir+'/app_themes/black/easyui.css',
//     'sunny':rootDir+'/app_themes/sunny/easyui.css'
// };
$(function () {
     /*布局部分*/
    $('#main-layout').layout({fit:true});  /*布局框架全屏*/
    $(window).resize(function () {
        $('#main-layout').layout('resize');
         var clientHeight = document.documentElement.clientHeight;
        $('#main-layout').css('height', clientHeight + 'px');
        $('#main-layout').layout('resize', {'height':clientHeight});
    });
    var clientHeight = document.documentElement.clientHeight;
    $('#main-layout').css('height', clientHeight + 'px');
    $('#main-layout').layout('resize', {'height':clientHeight});
    loadSkin();
});

function loadSkin(){
     var skin = ApiCaller.getItem('skin',false);
     switchSkin(skin);
}

function setAreaResize() {
     $('#main-layout').layout('resize');
}
function switchSkin(skinName) {
    skinName = 'green';
    $('#linkstyle').attr('href', urlConfig.themes[skinName]);
}
