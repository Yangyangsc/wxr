function treeGrid(table, option) {
    var _this = this;
    var _lastSelectedNode = null;
    var treeGrid = table;
     option = option || {};
    var dataUrl= option.url;
    option.url = null;
    if (option.fit == null) option.fit = true;
    if (option.loadMsg == null) option.loadMsg = '数据加载中...';
    if (option.doubleClickEdit != null && option.doubleClickEdit == true && option.idField != null) {
        option.onDblClickRow = function (row) {
            _this.editRecord(row[option.idField]);
        }
    }
    _this.treeOption = option;
    var init = function () {
         $('#' + treeGrid).treegrid(_this.treeOption);
        ApiCaller.callApi({url:dataUrl,type: _this.treeOption.method,successFunc:function(result){
            $('#' + treeGrid).treegrid('loadData',result.data);
        }})
        
        //$('#' + treeGrid).treegrid(_this.treeOption);
        ///绑定新建按钮
        if (option.createOption && option.createOption.button) {
            $(option.createOption.button).bind('click', function () { _this.addRecord(option.createOption) });
        }
        ///绑定删除按钮
        if (option.deleteOption && option.deleteOption.button) {
            $(option.deleteOption.button).bind('click', function () { _this.deleteRecord(null,option.deleteOption) });
        }
        ///绑定编辑按钮
        if (option.editOption && option.editOption.button) {
            $(option.editOption.button).bind('click', function () { _this.editRecord(null, option.editOption) });
        }
        ///绑定查看按钮
        if (option.viewOption && option.viewOption.button) {
            $(option.viewOption.button).bind('click', function () { _this.viewRecord(null, option.viewOption) });
        }
    };
    this.loadData = function (param) {
        //$('#' + treeGrid).treegrid('load', param);
        ApiCaller.callApi({url:dataUrl,data:param,type: _this.treeOption.method,successFunc:function(result){
            $('#' + treeGrid).treegrid('loadData',result.data);
        }})
    }
    ///刷新树
    this.reload = function (param) {
        this.loadData(param);
       // $('#' + treeGrid).treegrid('reload', param);
    }
    ///更新一个树节点
    this.updateNode = function(data, id)
    {
        var updateUid =id!=null?id:_this.selectedNode().id;
        $('#' + treeGrid).treegrid('update', { id: updateUid,row:data });
    }

    ///追加一个树节点
    this.appendNode = function (data, id)
    {
        var node = _this.selectedNode();
        if (id) node = $('#' + treeGrid).treegrid('find', id);
        $('#' + treeGrid).treegrid('append', { parent: (node ? node.id : null), data: data });
    }
    ///删除一一个节点
    this.removeNode = function (id)
    {
        if(id!=null)
            $('#' + treeGrid).treegrid('remove', id);
        else
            $('#' + treeGrid).treegrid('remove', this.selectedKeyValue());
    };
    ///当前选择的行
    this.selectedNode = function (fieldName) {
        var rowData = $('#' + treeGrid).treegrid('getSelected');
        if (rowData == null) return null;
        if (fieldName == null) return rowData;
        return rowData[fieldName];
    };
    ///当前选择的记录的主键值
    this.selectedKeyValue = function () {
        return _this.selectedNode()!=null?_this.selectedNode(_this.treeOption.idField):'';
    };
    ///查找一个树节点
    this.findNode = function (id)
    {
        return $('#' + treeGrid).treegrid('find', id);
    }
    ///获取一个指定的节点
    this.getNode = function (target)
    {
        return $('#' + treeGrid).treegrid('getNode', target);
    }
    ///获取一个指定节点的父对象
    ///如果没有指定对象，则返回当前节点的父对象
    this.getParent = function (id)
    {
        return $('#' + treeGrid).treegrid('getParent', id);
    }
    ///新建记录
    this.addRecord = function (createOption) {
        var orgoptions = createOption != null ? createOption : _this.treeOption.createOption;
        var options = {};
        $.extend(options, orgoptions);
        ///默认绑定创建后刷新数据
        if (!options.closeFunc) {
            options.closeFunc = function (result) {
                if (result) {
                    _this.appendNode(result);
                }
            }
        }
        dataForm.addRecord(options);
    }

    ///删除记录
    this.deleteRecord = function (keyValue, deleteOption) {
        if (_this.selectedNode() == null) {
            $.messager.alert('提示', '请选择删除项.', 'info');
            return;
        }
        var orgoptions = deleteOption != null ? deleteOption : _this.treeOption.deleteOption;
        var options = {};
        $.extend(options, orgoptions);
        if (options.urlJointId==null) options.urlJointId=true;
        if (options.urlJointId)
        {
            if (!$.endsWith(options.url,'/')) options.url=options.url+'/';
            ///为删除数据添加Key值
            if (keyValue == null && options.key==null) {
                options.url+= _this.selectedKeyValue();
            }
            else
                options.url+=keyValue;
        }
        if (options.confirm == null) options.confirm = true;
        ///默认绑定删除后刷新数据
        if (!options.successFunc) {
            options.successFunc = function (result) {
                if (result) _this.removeNode(_this.selectedKeyValue());
            }
        }
        dataForm.deleteRecord(options);
    }
    ///编辑记录
    this.editRecord = function (keyValue, editOption) {
        if (_this.selectedNode() == null) {
            $.messager.alert('提示', '请选择编辑项.', 'info');
            return;
        }
        if (_this.selectedKeyValue()=='') return;
        var orgoptions = editOption != null ? editOption : _this.treeOption.editOption;
        var options = {};
        $.extend(options, orgoptions);
       
        ///为删除数据添加Key值
        if ($.isNullOrEmpty(options.key)) {
            options.key = _this.selectedKeyValue();
        }
      
        ///默认绑定删除后刷新数据
        if (!options.closeFunc) {
            options.closeFunc = function (result) {
                if (result) {
                    var node = _this.findNode(result.id);
                    if (node!=null)
                        _this.updateNode(result, result.id);
                }
            }
        }
        dataForm.editRecord(options);
    }

    ///查看记录
    this.viewRecord = function (keyValue, viewOption) {
        if (_this.selectedNode() == null) {
            $.messager.alert('提示', '请选择查看项.', 'info');
            return;
        }
        var orgoptions = viewOption != null ? viewOption : _this.treeOption.viewOption;
        var options = {};
        $.extend(options, orgoptions);
        
        ///为删除数据添加Key值
        if ($.isNullOrEmpty(options.key)) {
            options.key = _this.selectedKeyValue();
        }
        dataForm.viewRecord(options);
    }
    ///初始化
    init();
}