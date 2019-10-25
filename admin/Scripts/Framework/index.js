
function addTab(title, url,closeable) {
    if (closeable==null) closeable = true;
    if ($('#tabs').tabs('exists', title)){
        $('#tabs').tabs('select', title);//选中并刷新
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if(url != undefined && currTab.panel('options').title != 'Home') {
            $('#tabs').tabs('update',{
                tab:currTab,
                options:{
                    content:createFrame(url)
                }
            })
        }
    } else {
        var content = createFrame(url);
        $('#tabs').tabs('add',{
            title:title,
            content:content,
            closable:closeable
        });
    }
    tabClose();
}
function createFrame(url) {
    //formHelper.loadingWait("页面加载中,请稍候......");
    var iframe = '<iframe scrolling="hidden"   frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>';
    return iframe;
}
function logout(){
    ApiCaller.clearUser();
}
function editPersonalInfo() {
    $('.theme-navigate-user-panel').menu('hide');
    dialogHelper.showModal({ title: '用户信息', url: './Admin/Personal.html?actiontype=edit', width: 800, height: 490, icon: 'icon-user', callbackFunc: { reload: function () { displayUserImage(); } } });
}
function tabClose() {
    /*双击关闭TAB选项卡*/
    $(".tabs-inner").dblclick(function(){
       // var subtitle = $(this).children(".tabs-closable").text();
        // $('#tabs').tabs('close',subtitle);
        $('#master').layout('collapse','north');  
    })
    /*为选项卡绑定右键*/
    $(".tabs-inner").bind('contextmenu',function(e){
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        var subtitle =$(this).children(".tabs-closable").text();

        $('#mm').data("currtab",subtitle);
        $('#tabs').tabs('select',subtitle);
        return false;
    });
}		
//绑定右键菜单事件
function tabCloseEven() {
    //刷新
    $('#mm-tabupdate').click(function(){
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if(url != undefined && currTab.panel('options').title != 'Home') {
            $('#tabs').tabs('update',{
                tab:currTab,
                options:{
                    content:createFrame(url)
                }
            })
        }
    })
    //关闭当前
    $('#mm-tabclose').click(function(){
        var currtab_title = $('#mm').data("currtab");
        $('#tabs').tabs('close',currtab_title);
    })
    //全部关闭
    $('#mm-tabcloseall').click(function(){
        $('.tabs-inner span').each(function(i,n){
            var t = $(n).text();
            if (t != 'Home' && t != '首页') {
                $('#tabs').tabs('close',t);
            }
        });
    });
    //关闭除当前之外的TAB
    $('#mm-tabcloseother').click(function(){
        var prevall = $('.tabs-selected').prevAll();
        var nextall = $('.tabs-selected').nextAll();		
        if(prevall.length>0){
            prevall.each(function(i,n){
                var t=$('a:eq(0) span',$(n)).text();
                if (t != 'Home' && t != '首页') {
                    $('#tabs').tabs('close',t);
                }
            });
        }
        if(nextall.length>0) {
            nextall.each(function(i,n){
                var t=$('a:eq(0) span',$(n)).text();
                if (t != 'Home' && t != '首页') {
                    $('#tabs').tabs('close',t);
                }
            });
        }
        return false;
    });
    //关闭当前右侧的TAB
    $('#mm-tabcloseright').click(function(){
        var nextall = $('.tabs-selected').nextAll();
        if(nextall.length==0){
            //msgShow('系统提示','后边没有啦~~','error');
            alert('后边没有啦~~');
            return false;
        }
        nextall.each(function(i,n){
            var t=$('a:eq(0) span',$(n)).text();
            $('#tabs').tabs('close',t);
        });
        return false;
    });
    //关闭当前左侧的TAB
    $('#mm-tabcloseleft').click(function(){
        var prevall = $('.tabs-selected').prevAll();
        if(prevall.length==0){
            alert('到头了，前边没有啦~~');
            return false;
        }
        prevall.each(function(i,n){
            var t=$('a:eq(0) span',$(n)).text();
            $('#tabs').tabs('close',t);
        });
        return false;
    });

    //退出
    $("#mm-exit").click(function(){
        $('#mm').menu('hide');
    })
}

var left_control_status=true;
$(function () {
    
    ///显示当前用户的相关信息
    displayUserInfo();
    
    initMainMenu();
    createHistoryFunctions();
    ///添加一个首页在tab
    addTab('首页','./home.html',false);
    tabCloseEven();

    $('.cs-navi-tab').click(function() {
        var $this = $(this);
        var href = $this.attr('src');
        var title = $this.text();
        addTab(title, href);
    });

  
    var left_control_panel=$("#master").layout("panel",'west');
    $(".left-control-switch").on("click",function(){
        if(left_control_status){
            left_control_panel.panel('resize',{width:70});
            left_control_status=false;
            $(".theme-left-normal").hide();
            $(".theme-left-minimal").show();
        }else{
            left_control_panel.panel('resize',{width:150});
            left_control_status=true;
            $(".theme-left-normal").show();
            $(".theme-left-minimal").hide();
        }
        $("#master").layout('resize', {width:'100%'})
    });


    var skins = $('.li-skinitem span').click(function() {
        var $this = $(this);
        if($this.hasClass('cs-skin-on')) return;
        skins.removeClass('cs-skin-on');
        $this.addClass('cs-skin-on');
        var skin = $this.attr('rel');
        $('#swicthstyle').attr('href', urlConfig.themes[skin]);

        var $iframe = $('iframe');
        if ($iframe.length > 0) {
            for (var i = 0; i < $iframe.length; i++) {
                var ifr = $iframe[i];
                if (ifr.contentWindow && typeof(ifr.contentWindow.switchSkin) == 'function')
                ifr.contentWindow.switchSkin(skin);
            }
        }
        ApiCaller.cacheItem('skin',skin);
        skin == 'dark-hive' ? $('.cs-north-logo').css('color', '#FFFFFF') : $('.cs-north-logo').css('color', '#000000');
    });
    var lastSkinName = ApiCaller.getItem('skin',false);
    lastSkinName='green';
    if(lastSkinName) {
        //  $('#linkstyle').attr('href', themes[lastSkinName]);
        // var skin = getCookie('cs-skin');
        $('#swicthstyle').attr('href', urlConfig.themes[lastSkinName]);
        $this = $('.li-skinitem span[rel='+lastSkinName+']');
        $this.addClass('cs-skin-on');
        lastSkinName == 'dark-hive' ? $('.cs-north-logo').css('color', '#FFFFFF') : $('.cs-north-logo').css('color', '#000000');
    }
});


function setCookie(name,value) {//两个参数，一个是cookie的名子，一个是值
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {//取cookies函数        
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}

function initMainMenu(menuData) {
    var userData = ApiCaller.getUser();
    var functionUrl = urlConfig.ApiUrl.userApi.Functions+userData.id;
    ApiCaller.Get({url:functionUrl,
                  // waitingMask:true,
                   successFunc:function (result) {
                            
                            $('#menu').bootstrapMenu({
                                data: result.data,
                                onSelect: function (menuItem) {
                                    if (!$.isNullOrEmpty(menuItem.url)) {
                                        if (menuItem.target == '0')
                                            addTab(menuItem.title, menuItem.url);
                                        else if (menuItem.target == '1')
                                            window.open(menuItem.url, "_blank");
                                    }
                                }
                            });
                             $('#minMenu').minMenu({data: result.data});
                            $.parser.parse('#menu,#minMenu');
                            
                     }
            });
    
}
function openMenu(index){
    $('#menu').accordion('select',index);
      var left_control_panel=$("#master").layout("panel",'west');
      left_control_panel.panel('resize',{width:150});
      left_control_status=true;
      $(".theme-left-normal").show();
      $(".theme-left-minimal").hide();
      $("#master").layout('resize', {width:'100%'})
      
}
function menuClick(item){
    var menuItem = eval('(' + $(item).data('name') + ')');
    if (!menuItem) return;
    if (!$.isNullOrEmpty(menuItem.url)) {
        if (menuItem.target == '0')
            addTab(menuItem.title, menuItem.url);
        else if (menuItem.target == '1')
            window.open(menuItem.url, "_blank");
    }
    recordUserAction(menuItem);
}
/***记录用户最近使用的系统功能 */
function recordUserAction(item){
    var historyFunc = ApiCaller.getItem('function');
    if (historyFunc==null) historyFunc = [];
    for(var iLoop=0;iLoop<historyFunc.length;iLoop++){
        var menu = historyFunc[iLoop];
        if (menu.name===item.name) {
            historyFunc.splice(iLoop,1);
            break;
        }
    }
    historyFunc.splice(0,0,item);
    ApiCaller.cacheItem('function',historyFunc);
    createHistoryFunctions();
}
/***构建常用菜单 */
function createHistoryFunctions(){
     var historyFunc = ApiCaller.getItem('function');
     if (historyFunc==null || historyFunc.length<=0) return;
     var menuHtml=[];
     historyFunc.forEach(function(c,index){
         menuHtml.push('<div>',
                                '<a onclick="menuClick(this)"  data-name="{title:\'' + c.title + '\',url:\'' + c.url + '\',target:\''+c.target+'\'}" href="#">',
									c.title,
								'</a>',
                       '</div>')
     })
     $('#mmHistory').append(menuHtml.join(''));
}
function addMenu2History(item){

}

function displayUserInfo() {
    var userCache = ApiCaller.getUser();
    $('#hrefUserName,#spanLeftUserName,#spanUserName').text(userCache.name);
    $('#spanLeftAccount,#spanAccount').text(userCache.account);
    if (!$.isNullOrEmpty(userCache.photo))
        $('#userImage,#imgLeftHeader').attr('src', urlConfig.base.imageBase + userCache.photo);
}