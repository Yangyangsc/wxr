var modalWins = [];
var dialogHelper = {
    // 初始化变量
    //jqueryUI_modalWins: [],
    topObj: function () {
        var p = window;
        var topObj = p;
        while (p.self != p.parent) {
            topObj = p;
            p = p.parent;
        }
        try {
            var tmp = p.parent.document;
            topObj = p.parent;
        } catch (e) { }
        return topObj;
    },
    // 打开模态窗口
    showModal: function (showOption) {//title, url, width, height,closefunction,icon, allowMax, allowResize) {
        if (!showOption.width) showOption.width = '700';
        if (!showOption.height) showOption.height = '500';
        if (!showOption.icon) showOption.icon = 'icon-edit';
        if (showOption.allowMax == null) showOption.allowMax = false;
        if (showOption.allowResize == null) showOption.allowResize == false;
        if (!$.startWith(showOption.url,'http://') && !$.startWith(showOption.url,'https://')){
            showOption.url =urlConfig.base.Root+($.startWith(showOption.url,'/')?'':'/')+ showOption.url
        }
        var currentid = 'div' + Math.ceil(Math.random() * 1000000);
        var topWnd = this.topObj();
        topWnd.$("body").append('<div id="' + currentid + '" style="overflow:hidden"><iframe  frameborder="0" width="100%" src="' + showOption.url + '" height="100%"></iframe></div>');
        var cDialog = topWnd.$('#' + currentid);
        if (!topWnd.modalWins) topWnd.modalWins = [];
        topWnd.modalWins.push({ id: currentid, closeFunc: showOption.closeFunc, returnVal: null, extension: showOption.extension, callbackFunc: showOption.callbackFunc, parentWnd: window });
        cDialog.dialog({
            width: showOption.width,
            height: showOption.height,
            modal: true,
            title: showOption.title,
            maximizable: showOption.allowMax,
            resizable: showOption.allowResize,
            iconCls: showOption.icon,
            onClose: function () {
                //$(this).dialog('destroy');
            },
            onMaximize: function () {
				//var iframe = $("iframe").contents();
				//var iframeCtrl = $("iframe").contents().find('#iframeCtrl').val();
				//if(iframeCtrl){
				//    $("iframe")[0].contentWindow.resizeB();
                //}
                var iframe =topWnd.$("body").find("#"+currentid).find("iframe")[0];
                //alert(typeof (iframe.contentWindow.windowResize));
                if (typeof (iframe.contentWindow.windowResize) == 'function') iframe.contentWindow.windowResize(1);
			},
			    onMove: function (left, top) {  //Drag the mouse events
			        if (top < 1) {
			            cDialog.dialog('move', {
			                left: left,
			                top: 1
			            });
			        }
			    },
			onRestore:function(){
				var iframe = $("iframe").contents();
				var iframeCtrl = $("iframe").contents().find('#iframeCtrl').val();
				if(iframeCtrl){
				    $("iframe")[0].contentWindow.resizeA();
				}
			}
        });
    },

    closeModal: function (returnValue) {
        var topWnd = this.topObj();
        if (topWnd.modalWins.length > 0) {
            var currentWin = topWnd.modalWins.pop();
            if (currentWin && currentWin.closeFunc) {
                if (typeof (currentWin.closeFunc) == "function")
                    currentWin.closeFunc(returnValue, currentWin.extension);
            }
            topWnd.$('#' + currentWin.id).dialog('destroy');
        }
    },
    ///获得真实父对象
    getParentWnd: function () {
        var topWnd = this.topObj();
        if (topWnd.modalWins.length > 0) {
            var currentWin = topWnd.modalWins[topWnd.modalWins.length-1];
            return currentWin.parentWnd;
        }
        return null;
    },
    ////调用父窗口方法,不知道为什么在Chrome下不成功
    callParentFunc: function (funname,param) {
        var parentWnd = this.getParentWnd();
        if (parentWnd == null) return;
        if (parentWnd[funname] && typeof(parentWnd[funname])=='function')
            parentWnd[funname](param);
    },
    callbackFunc: function (func, param) {
        var topWnd = this.topObj();
        if (topWnd.modalWins.length > 0) {
            var currentWin = topWnd.modalWins[topWnd.modalWins.length - 1];
            var callBack = currentWin.callbackFunc;
            if (callBack != null && callBack[func] != null && typeof (callBack[func]) == 'function') {
                callBack[func](param);
            }
        }
    }

}

       