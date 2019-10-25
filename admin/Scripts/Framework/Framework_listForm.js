function listForm(table, option) {
    var _this = this;
    var listGrid = table;
    var lastSearchParam = {};
    var _userToken = ApiCaller.getUser().token;
    if (option.pagination == null) option.pagination = true;
    if (option.singleSelect == null) option.singleSelect = true;
    if (option.fit == null) option.fit = true;
    if (option.loadMsg == null) option.loadMsg = '数据加载中...';
    if (option.method==null) option.method="GET";
    ////处理列表加载数据时，用户token无效或过期
    // var afterLoadedFunc = option.onLoadSuccess;
    // option.onLoadSuccess= function(data){
    //     alert(JSON.stringify(data));
    //     if (!data.successed) {
    //          if (data.errorcode==10000 || ////未认证
    //             data.errorcode==9999 ||  ///Token 无效
    //             data.errorcode==9998 ||  ///Token过期
    //             data.errorcode==9100)   ///没有权限
    //             ApiCaller.redirectToLogin(true);
    //     }
    //     else
    //         dataForm.callFunc(afterLoadedFunc,data)
    // }
    if (!$.startWith(option.url,'http://') && !$.startWith(option.url,'https://')){
        option.url =urlConfig.base.ApiRoot+($.startWith(option.url,'/')?'':'/')+ option.url
    }
    if (option.doubleClickEdit != null && option.doubleClickEdit == true && option.idField!=null) {
        option.onDblClickRow = function (rowIndex, rowData) {
            _this.editRecord(rowData[option.idField]);
        }
    }
    ///数据加载之前,设置调用的Token
    if (option.onBeforeLoad==null){
        option.onBeforeLoad = function(param){
            param["access_token"]=_userToken;
            //alert(JSON.stringify(param));
        }
    }
    if (option.pageSize == null) option.pageSize = 30;
    _this.listOption = option;
    var init = function () {
        $('#' + listGrid).datagrid(_this.listOption);
        if (option.pagination) {
            var p = $('#' + listGrid).datagrid('getPager');
            $(p).pagination({
                pageSize: option.pageSize != null ? option.pageSize : 30,//每页显示的记录条数，默认为10  
                pageList: option.pageList != null ? option.pageList : [10, 30, 50],//可以设置每页记录条数的列表  
                beforePageText: '第',//页数文本框前显示的汉字  
                afterPageText: '页    共 {pages} 页',
                displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
            });
        }
        ///初始化查询定义
        if (option.searchOption) {
          
            if (option.searchOption.searchButton) {
                $(option.searchOption.searchButton).unbind();
                $(option.searchOption.searchButton).bind('click', function () { _this.search(option.searchOption) });
            }
            if (option.searchOption.resetButton) {
                $(option.searchOption.resetButton).unbind();
                $(option.searchOption.resetButton).bind('click', function () { _this.resetSearch(option.searchOption) });
            }
        }
        ///导出记录到Excel的配置
        if (option.excelOption){
            $(option.excelOption.button).unbind();
            $(option.excelOption.button).bind('click', function () { _this.exportExcel(option.excelOption) });
        }
        ///绑定新建按钮
        if (option.createOption && option.createOption.button) {
            $(option.createOption.button).unbind();
            $(option.createOption.button).bind('click', function () { _this.addRecord(option.createOption) });
        }
        ///绑定删除按钮
        if (option.deleteOption && option.deleteOption.button) {
            $(option.deleteOption.button).unbind();
            $(option.deleteOption.button).bind('click', function () { _this.deleteRecord(null,option.deleteOption) });
        }
        ///绑定编辑按钮
        if (option.editOption && option.editOption.button) {
            $(option.editOption.button).unbind();
            $(option.editOption.button).bind('click', function () { _this.editRecord(null, option.editOption) });
        }
        ///绑定查看按钮
        if (option.viewOption && option.viewOption.button) {
            $(option.viewOption.button).unbind();
            $(option.viewOption.button).bind('click', function () { _this.viewRecord(null, option.viewOption) });
        }
    };
    this.loadData = function (param) {
        // param["access_token"]=_userToken;
        $('#' + listGrid).datagrid('load', param);
    }
    ///列表查询
    this.search = function (searchOption) {
        var searchKey = getSearchValue();
        if (searchOption == null) searchOption = _this.listOption.searchOption;
        if (searchOption != null && searchOption.beforeFunc != null && typeof (searchOption.beforeFunc) == 'function') {
            searchOption.beforeFunc(searchKey);
        }
        lastSearchParam=searchKey;
        $('#' + listGrid).datagrid('load', searchKey);
    };

    ///重置查询
    this.resetSearch = function (resetOption) {
        var searchKey = resetSearchControl();
        if (resetOption == null) resetOption = _this.listOption.searchOption;
        if (resetOption != null && resetOption.beforeFunc != null && typeof (resetOption.beforeFunc) == 'function') {
            resetOption.beforeFunc(searchKey,true);
        }
        lastSearchParam =searchKey;
        $('#' + listGrid).datagrid('load', searchKey);
    };
    ///导出Excel文件
    this.exportFile = function (exportKey,fileName) {
        var searchKey = getSearchValue();
        if (_this.listOption.searchOption != null && _this.listOption.searchOption.beforeFunc != null && typeof (_this.listOption.searchOption.beforeFunc) == 'function') {
            _this.listOption.searchOption.beforeFunc(searchKey);
        }
        searchKey.exportExcel = true;
        searchKey.fileName = fileName;
        searchKey.exportKey = exportKey;
        $.download(_this.listOption.url, searchKey);
    }
   
    ///当前选择的行
    this.selectedRow = function (fieldName) {
        var rowData = $('#' + listGrid).datagrid('getSelected');
        if (rowData == null) return null;
        if (fieldName == null) return rowData;
        return rowData[fieldName];
    };
    ///获取到当前页面的所有记录
    this.getRows = function () {
        return $('#' + listGrid).datagrid('getRows');
    };
    ///当前选择的记录的主键值
    this.selectedKeyValue = function () {
        var row = _this.selectedRow();
        if (_this.listOption == null || _this.listOption.idField==null) return null;
        return _this.selectedRow(_this.listOption.idField);
    };
    ///获取某一行的索引号
    this.getRowIndex = function (row) {
        var rowItem = row ? row : _this.selectedRow();
        if (rowItem != null) return $('#' + listGrid).datagrid('getRowIndex', rowItem);
        return -1;
    }
    ///选择一行记录
    this.select = function (rowIndex) {
        if (rowIndex>=0)     $('#' + listGrid).datagrid('selectRow', rowIndex);
    }
    ///选择到最后一行
    this.selectLastRow = function () {
        var lastIndex = _this.getRows().length - 1;
        if (lastIndex >= 0) _this.select(lastIndex);
    }
    ///选择到第一行
    this.selectFirstRow = function () {
        var rowCount = _this.getRows().length;
        if (rowCount > 0) _this.select(0);
    }
    ///获取当前选择的所有行
    this.getSelections = function (fieldName) {
        var rowDatas = $('#' + listGrid).datagrid('getSelections');
        if (!fieldName || fieldName == '') return rowDatas;
        var arr = new Array();
        $(rowDatas).each(function (index, value) {
            arr[index] = value[fieldName];
        });
        return arr;
    }
    ///导出记录到Excel
    this.exportExcel=function(excelOption){
        var orgoptions = excelOption != null ? excelOption : _this.listOption.excelOption;
        var options = {};
        $.extend(options, orgoptions);
        var dataUrl = _this.listOption.url;
        var exportData =lastSearchParam || {};
        exportData.exportexcel = true;
        exportData.excelkey=options.excelkey;
         exportData.sort = $('#'+listGrid).datagrid.defaults.sortName;
         if (!$.isNullOrEmpty(exportData.sort)) exportData.order = $('#'+listGrid).datagrid.defaults.sortOrder;

        if (options.beforeFunc != null && typeof (options.beforeFunc) == 'function') {
            options.beforeFunc(exportData);
        }
        ApiCaller.Get({url:dataUrl,data:exportData,successFunc:function(result){
            $.downloadByLink(urlConfig.base.ApiRoot+'/download/excel/'+result.fileName+'?fileName='+options.fileName);
        }})
        // var searchKey = getSearchValue();
        // if (_this.listOption.searchOption != null && _this.listOption.searchOption.beforeFunc != null && typeof (_this.listOption.searchOption.beforeFunc) == 'function') {
        //     _this.listOption.searchOption.beforeFunc(searchKey);
        // }
        // searchKey.exportExcel = true;
        // searchKey.fileName = fileName;
        // searchKey.exportKey = exportKey;
        
    }
    ///新建记录
    this.addRecord = function (createOption) {
        var orgoptions = createOption != null ? createOption : _this.listOption.createOption;
        var options = {};
        $.extend(options, orgoptions);
        ///默认绑定创建后刷新数据
        if (!options.closeFunc) {
            options.closeFunc = function (result) {
                if (result) _this.reload();
            }
        }
        dataForm.addRecord(options);
    }

    ///删除记录
    this.deleteRecord = function (keyValue, deleteOption) {
        var orgoptions = deleteOption != null ? deleteOption : _this.listOption.deleteOption;
        var options = {};
        $.extend(options, orgoptions);
        ///是否需要将列表中选择的行的主键值添加到API Url 的末尾
        if (options.urlJointId==null) options.urlJointId=true;
        if (options.urlJointId)
        {
            if (!$.endsWith(options.url,'/')) options.url=options.url+'/';
            ///为删除数据添加Key值
            if (keyValue == null && options.key==null) {
                var keyItems;
                if (options.keyField)
                    keyItems= _this.getSelections(deleteOption.keyField).join(',');
                else
                    keyItems= _this.getSelections(_this.listOption.idField).join(',');
                if (keyItems.length<=0 || keyItems==','){
                    $.messager.alert('提示','请选择需要删除的记录','info');
                    return false;
                }
                options.url+= keyItems;
            }
            else
                options.url+=keyValue;
        }
        if (options.confirm == null) options.confirm = true;
        ///默认绑定删除后刷新数据
        if (!options.successFunc) {
            options.successFunc = function (result) {
                if (result) _this.reload();
            }
        }
        dataForm.deleteRecord(options);
    }
    ///编辑记录
    this.editRecord = function (keyValue,editOption) {
        var orgoptions = editOption != null ? editOption : _this.listOption.editOption;
        var options = {};
        $.extend(options, orgoptions);
        ///为删除数据添加Key值
        if (keyValue == null && options.key==null) {
            if (options.keyField)
                options.key = _this.selectedRow(options.keyField);
            else
                options.key = _this.selectedKeyValue();
        }
        else
            options.key = keyValue;
        if ($.isNullOrEmpty(options.key)){
            $.messager.alert('提示','请选择记录进行编辑','info');
            return false;
        }
        ///默认绑定删除后刷新数据
        if (!options.closeFunc) {
            options.closeFunc = function (result) {
                if (result) _this.reload();
            }
        }
        dataForm.editRecord(options);
    }

    ///查看记录
    this.viewRecord = function (keyValue,viewOption) {
        var orgoptions = viewOption != null ? viewOption : _this.listOption.viewOption;
        var options = {};
        $.extend(options, orgoptions);
        ///为查看数据添加Key值
        if (keyValue == null && options.key==null) {
            if (options.keyField)
                options.key = _this.selectedRow(options.keyField);
            else
                options.key = _this.selectedKeyValue();
        }
        else
            options.key = keyValue;
        if ($.isNullOrEmpty(options.key)){
            $.messager.alert('提示','请选择记录进行查看','info');
            return false;
        }
        dataForm.viewRecord(options);
    }
    ///刷新列表数据
    this.reload = function (param) {
        $('#' + listGrid).datagrid('reload', param);
        $('#' + listGrid).datagrid('clearSelections').datagrid('clearChecked');
    };
    ///删除一行
    this.removeRow = function (rowindex) {
        var index = rowindex == null ? $('#' + listGrid).datagrid('getRowIndex', _this.selectedRow()) : rowindex;
        $('#' + listGrid).datagrid('deleteRow', index);
    },
    ///添加一行
    this.appendRow = function (data) {
        $('#' + listGrid).datagrid('appendRow', data);
    },
    this.updateRow = function (data, rowIndex) {
        var index = rowIndex ? rowIndex : $('#' + listGrid).datagrid('getRowIndex', _this.selectedRow());
        $('#' + listGrid).datagrid('updateRow', { index: index, row: data });
    }
    ///
    this.getRowIndex = function (KeyValue) {
        var itemIndex = $('#' + listGrid).datagrid('getRowIndex', KeyValue);
        return itemIndex;
    }
    ///重置查询控件中的值
    var resetSearchControl = function () {
        var searchValue = {};
        $('*[search-options]').each(function (index, item) {
            var searchItem = eval('({' + item.attributes['search-options'].value + '})');
            var method = searchItem.method != null ? searchItem.method : '';
            switch (method.toLowerCase()) {
                case 'combobox':
                    $(item).combobox('setValue', searchItem.defaultvalue || '');
                    //$(item).combobox('setValues',[]);
                    break;
                case 'datebox':
                    $(item).datebox('setValue', searchItem.defaultvalue || '');
                    break;
                case 'checkbox':
                    $(item).attr("checked", (searchItem.defaultvalue || '') == "1");
                default:
                    $(item).val(searchItem.defaultvalue || '');
            }
            searchValue[searchItem.key] = searchItem.defaultvalue || '';
        });
        return searchValue;
    }
    ///通过界面上具有search-option的属性拼装
    var getSearchValue = function () {
        var searchValue = {};
        $('*[search-options]').each(function (index, item) {
            var searchItem = eval('({' + item.attributes['search-options'].value + '})');
            var method = searchItem.method != null ? searchItem.method : '';
            switch (method.toLowerCase()) {
                case 'combobox': searchValue[searchItem.key] = $(item).combobox('getValue'); break;
                case 'datebox': searchValue[searchItem.key] = $(item).datebox('getValue'); break;
                case 'checkbox': searchValue[searchItem.key] = $(item).attr("checked") == "checked" ? "1" : "0";
                default:
                    searchValue[searchItem.key] = $(item).val();
            }
        });
        return searchValue;
    }

    ///初始化
    init();
}