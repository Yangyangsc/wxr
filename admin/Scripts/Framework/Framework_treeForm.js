function treeForm(table, option) {
    var _this = this;
    var _lastSelectedNode = null;
    var treeView = table;
    option = option || {};
    var dataUrl= option.url;
    option.url = null;
    if (option.fit == null) option.fit = true;
    if (option.method == null) option.method = "GET";
    if (option.loadMsg == null) option.loadMsg = '数据加载中...';
    

    if (option.onSelect == null) {
        option.onSelect = function (node) {
            if (_lastSelectedNode == null || _lastSelectedNode.id != node.id) {
                _lastSelectedNode = node;
                if (option.onSelectChanged != null && typeof (option.onSelectChanged) == 'function')
                    option.onSelectChanged(node);
            }
        }
    }
    if (option.onLoadSuccess == null) {
        option.onLoadSuccess = function (node, data) {
            if (_lastSelectedNode != null) return;
            var nodeSelect = _this.getRoot();
            if (nodeSelect != null) {
                _this.select(nodeSelect.target);
                _lastSelectedNode = nodeSelect;
            }
        }
    }
    _this.treeOption = option;
    var init = function () {
        $('#' + treeView).tree(_this.treeOption);
        ApiCaller.callApi({url:dataUrl,type: _this.treeOption.method,successFunc:function(result){
            $('#' + treeView).tree('loadData',result.data);
        }})
        
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
        $('#' + treeView).tree('load', param);
    }
    ///设置最后选择的节点
    this.setLastSelectNode = function(node)
    {
        _this._lastSelectedNode = node;
    }
    ///获取最后选择的节点
    this.getLastSelectNode = function()
    {
        return _this._lastSelectedNode;
    }
    ///获取从一个节点开始的完整路劲
    this.getFullPath = function(retText,node)
    {
        var fullDir = '';
        var nodeStart = node ? node : _this.selectedNode();
        if (nodeStart != null) {
            var tmpNode = lastSelectedNode;
            while (tmpNode != null) {
                fullDir = tmpNode[retText] + '|' + fullDir;
                tmpNode = $('#' + treeView).tree('getParent', tmpNode.target);
            }
        }
        return fullDir;
    }
    ///更新一个树节点
    this.updateNode = function(data, nodeItem)
    {
        var node =nodeItem?nodeItem:_this.selectedNode();
        if (node != null) {
            $('#' + treeView).tree('update', data);
        }
    }
    ///获取到根节点
    this.getRoot= function(onlyOne)
    {
        if (onlyOne==null)onlyOne=false;
        if (!onlyOne)
            return $('#' + treeView).tree('getRoots');
        return $('#' + treeView).tree('getRoot');
    }
    
    ///选择中指定的节点
    this.select=function(node)
    {
        if (node != null) {
            $('#' + treeView).tree('select', node.target);
            _this.setLastSelectNode(node);
        }
    }

    ///追加一个树节点
    this.appendNode = function(data,parentNode) //(data, id)
    {
        var node;
        if (typeof(parentNode)=="object")
            node=parentNode?parentNode:_this.selectedNode();
        else if (typeof(parentNode)=="string")
            node = $('#' + treeView).tree('find', parentNode);
        $('#' + treeView).tree('append', { parent: (node ? node.target : null), data: data });
    }
    ///删除一一个节点
    this.removeNode = function (id)
    {
        var node = _this.selectedNode();
        if (id) {
            node = $('#' + treeView).tree('find', id);
        }
        var parentNode = $('#' + treeView).tree('getParent', node.target);
        $('#' + treeView).tree('remove', node.target);
        if (parentNode != null)
            $('#' + treeView).tree('select', parentNode.target);
    };
    ///当前选择的行
    this.selectedNode = function (fieldName) {
        var rowData = $('#' + treeView).tree('getSelected');
        if (rowData == null) return null;
        if (fieldName == null) return rowData;
        return rowData[fieldName];
    };
    ///当前选择的记录的主键值
    this.selectedKeyValue = function () {
        return _this.selectedNode('id');
    };
    ///查找一个树节点
    this.findNode = function (id)
    {
        return $('#' + treeView).tree('find', id);
    }
    ///获取一个指定的节点
    this.getNode = function (target)
    {
        return $('#' + treeView).tree('getNode', target);
    }
    ///获取一个指定节点的父对象
    ///如果没有指定对象，则返回当前节点的父对象
    this.getParent = function (target)
    {
        if (target != null) return $('#' + treeView).tree('getParent', target);
        var node = _this.selectedNode();
        if (node != null) return $('#' + treeView).tree('getParent', node.target);
        return null;
    }
    ///关闭所有的节点
    this.collapseAll = function () {
        $('#' + treeView).tree('collapseAll');
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
                    _this.appendNode([{ id: result.id, text: result.extInfo, iconCls: result.iconCls }]);
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
                if (result) _this.removeNode();
            }
        }
        dataForm.deleteRecord(options);
    }
    ///编辑记录
    this.editRecord = function (keyValue, editOption) {
       
        var orgoptions = editOption != null ? editOption : _this.treeOption.editOption;
        var options = {};
        $.extend(options, orgoptions);
        ///为删除数据添加Key值
        if ($.isNullOrEmpty(options.key)) {
            options.key = _this.selectedKeyValue();
        }
        if ($.isNullOrEmpty(options.key)) {
            $.messager.alert('提示', '请选择编辑项.', 'info');
            return;
        }
        ///默认绑定删除后刷新数据
        if (!options.closeFunc) {
            options.closeFunc = function (result) {
                if (result) {
                    var node = _this.findNode(result.id);
                    if (node!=null)
                        _this.updateNode({ target: node.target, text: (result.text || node.text), iconCls:(result.iconCls||node.iconCls) }, node);
                }
            }
        }
        dataForm.editRecord(options);
    }

    ///查看记录
    this.viewRecord = function (keyValue, viewOption) {
        if (_this.selectedNode()==null) {
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