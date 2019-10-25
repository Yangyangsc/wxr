//公共方法
var formHelper = {
    ///初始化界面上的弹出框按钮事件
    initializePopup: function () {
        var allItems = $('a[popup-options]');
        $(allItems).each(function (index, item) {
            if ($(item).attr('popup-options')) {
                var option = eval('({' + $(item).attr('popup-options') + '})');
                if (!option.type) option.type = 'list';
                if (!option.width) option.width = 500;
                if (!option.height) option.height = 550;
                //if (!option.icon) option.icon = 'icon-user';
                if (!option.datakey) option.datakey = 'selectUser';
                if (!option.title) option.title = '用户选择';
                if (option.controlInstance && option.controlInstance.length > 0 && option.afterSelectFunc == null) {
                    option.afterSelectFunc = function (obj) {
                        if (obj != null && option != null && option.controlInstance.length > 0) {
                            $(option.controlInstance).each(function (index, item) {
                                var easyuiCss = $('#' + item.control).hasClass('easyui-textbox');
                                if (obj.length) {
                                    var strAll = '';
                                    for (var iIndex = 0; iIndex < obj.length; iIndex++)
                                        strAll = strAll + obj[iIndex][item.key] + ',';
                                    if (strAll.length > 0) strAll = strAll.substring(0, strAll.length - 1)
                                    if (easyuiCss)
                                        $('#' + item.control).textbox('setValue',strAll);
                                    else
                                        $('#' + item.control).val(strAll);
                                }
                                else
                                {
                                    if (easyuiCss)
                                        $('#' + item.control).textbox('setValue',obj[item.key]);
                                    else
                                        $('#' + item.control).val(obj[item.key]);
                                }
                                if (item.validate){
                                if (easyuiCss)
                                    $('#' + item.control).textbox('validate');
                                else
                                     $('#' + item.control).validatebox('validate');
                                }
                            });
                        }
                    }
                }
                $(item).bind('click', function () { formHelper.popupSelect(option); });
                ///注册关闭的回调事件

            }
        });
    },
    ///弹出通用选择对话框
    popupSelect: function (selectOption) {
        if (selectOption && selectOption.datakey) {
        
            if (selectOption.type==null) selectOption.type="list";
            switch(selectOption.type.toLowerCase())
            {
                case "list":   selectOption.url = selectOption.url  || (urlConfig.base.Root+'/CommonSelect/CommonSelector.html'); break;
                case "tree":   selectOption.url = urlConfig.base.Root+'/CommonSelect/HierarchySelector.html'; break;
                default: selectOption.url = selectOption.url  || (urlConfig.base.Root+'/CommonSelect/CommonSelector.html'); break;
            }
            var joint = selectOption.url.indexOf('?') > 0 ? '&' : '?';
            var fullParam = joint + "datatype=" + selectOption.datakey;
            
            if (selectOption.param)
            {
                Object.keys(selectOption.param).forEach(function(key){
                    fullParam+="&"+key+"="+selectOption.param[key];
                });
            }
            if (selectOption.multiselect == null) selectOption.multiselect = false;
            if (selectOption.multiselect) fullParam = fullParam + "&multiSelect=true";
            ///该属性仅用于层级树选择，表示仅叶子节点可选
            if (selectOption.onlyleaf == null) selectOption.onlyleaf = false;
            if (selectOption.onlyleaf) fullParam = fullParam + "&onlyleaf=true";

            if (selectOption.beforePopFilterFunc && typeof (selectOption.beforePopFilterFunc) == 'function') fullParam = fullParam + selectOption.beforePopFilterFunc();
            dialogHelper.showModal({
                title: selectOption.title,
                url: selectOption.url + fullParam + '&random=' + Math.random(),
                width: selectOption.width,
                height: selectOption.height,
                closeFunc: selectOption.afterSelectFunc,
                icon: selectOption.icon,
                extension: selectOption
            });
        }
    },
    ///图片查看
    directViewImage: function (imgControl,viewWidth,viewHeight){
        formHelper.viewImage({url:imgControl.src,width:viewWidth,height:viewHeight});
    }, 
    viewImage: function (viewOption) {
        if (!viewOption.width) viewOption.width = 600;
        if (!viewOption.height) viewOption.height = 450;
        var fullUrl = urlConfig.base.Root + '/CommonSelect/imageViewer.html?imageUrl=' + viewOption.url;
        dialogHelper.showModal({
            title: 'Image Viewer',
            url: fullUrl + '&random=' + Math.random(),
            width: viewOption.width,
            height: viewOption.height,
            closeFunc: viewOption.afterSelectFunc,
            icon: viewOption.icon,
            extension: urlConfig.base.Root
        });
    },
    ///删除图片附件
    deleteAttachment:function(id,cb) {
        $.messager.confirm('删除确认','确认要删除该文件吗?',function(r){
            if(r){
                ApiCaller.Delete({url:'/attachment/'+id,successFunc:cb});
            }
        }
        )
    },
    ///弹出文件选择对话框
    popupTradeAreaSelect: function (data) {
        if (data) {
            var fullParam = "";
            if (data.multiselect) fullParam = fullParam + "&multiselect=true";
            if (data.beforePopFilterFunc && typeof (data.beforePopFilterFunc) == 'function') fullParam = fullParam + data.beforePopFilterFunc();
            dialogHelper.showModal({
                title: data.title,
                url: rootVirtual + '/CommonSelect/TradeAreaSelector.aspx?' + fullParam + '&random=' + Math.random(),
                width: data.width,
                height: data.height,
                closeFunc: data.afterSelectFunc,
                icon: 'icon-folderCloseSmall'
            });
        }
    },
   
    bindComboWithConst: function (ctrlid, constData) {
        if (constData == null || constData.length <= 0) return;
        var jsonArray = new Array();
        for (var index = 0; index < constData.length; index++) {
            var item = { id: index, text: constData[index] };
            jsonArray.push(item);
        }
        this.bindCombo({ bindControl: ctrlid, bindData: jsonArray });
    },
    ////绑定字典项到Combox中
    bindCombo: function (bindOption) {//bindControl, dictCode, textControl) {
        if (bindOption.combobox == '' || bindOption.data == null) return;
        if ($('#' + bindOption.combobox) == null) return;
        if (!bindOption.valueField) bindOption.valueField = 'id';
        if (!bindOption.textField) bindOption.textField = 'text';
        if (bindOption.editable == null) bindOption.editable = false;
        $('#' + bindOption.combobox).combobox({
            valueField: bindOption.valueField,
            textField: bindOption.textField,
            editable: bindOption.editable,
            data: bindOption.data,
            panelHeight: 'auto'
        });
    },
    ////绑定字典项到Combox中
    bindComboByRemote: function (bindOption) {//bindControl, dictCode, textControl) {
        if (bindOption.bindControl == '' || bindOption.url == null) return;
        if ($('#' + bindOption.bindControl) == null) return;
        if (!bindOption.valueField) bindOption.valueField = 'id';
        if (!bindOption.textField) bindOption.textField = 'text';
        if (bindOption.editable == null) bindOption.editable = false;
        if (!bindOption.panelHeight) bindOption.panelHeight = 'auto';
        if (!$.startWith(bindOption.url,'http://') && !$.startWith(bindOption.url,'https://')){
           bindOption.url = urlConfig.base.ApiRoot+($.startWith(bindOption.url,'/')?'':'/')+bindOption.url;
       }
        bindOption.onLoadSuccess || (bindOption.onLoadSuccess = function () { });
        $('#' + bindOption.bindControl).combobox({
            url: bindOption.url,
            method: 'get',
            valueField: bindOption.valueField,
            textField: bindOption.textField,
            editable: bindOption.editable,
            panelHeight: bindOption.panelHeight,
            onLoadSuccess: bindOption.onLoadSuccess,
            onSelect: function (rec) {
                if (rec) {
                    if (bindOption.hideControl)
                        $('#' + bindOption.hideControl).val(rec[bindOption.textField]);
                    if ($.isFunction(bindOption.afterSelect)) {
                        bindOption.afterSelect(rec[bindOption.valueField]);
                    }
                }
            }
        });
    },
    ///显示一个转圈的正在处理的图标，提示用户等待
    loadingWait: function (waitMsg) {
        if (!waitMsg) waitMsg = '正在处理，请稍候...';
        $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
        $("<div class=\"datagrid-mask-msg\"></div>").html(waitMsg).appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
    },
    ///处理完毕，转圈的图标消失
    loadEnd: function () {
        $(".datagrid-mask").remove();
        $(".datagrid-mask-msg").remove();
    }
}