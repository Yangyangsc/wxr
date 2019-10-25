var userlist, treeForm;
///初始化列表控件
function InitUserGrid() {
    userlist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/user',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
            searchButton: '#btnSearch', resetButton: '#btnReset', beforeFunc: function (result) {
                if (treeForm.selectedNode()!=null)  result.deptUid = treeForm.selectedKeyValue();
                return true;
            }},
        createOption: {
            button: '#btnNewUser', url:'/Admin/UserDetail.html', icon: 'icon-user', title: '用户信息', width: 720, height: 460, beforeFunc: function (option) {
                var keyValue =  treeForm.selectedKeyValue();
                if (!$.isNullOrEmpty(keyValue))
                    option.url = option.url + '&deptUid=' + keyValue + '&deptname=' + escape(treeForm.selectedNode()==null?'':treeForm.selectedNode().text)
                return true;
            }
        },
        deleteOption: { button: '#btnDeleteUser', url:'/user/' },
        editOption: { url:  '/Admin/UserDetail.html',dataUrl:'/user/', icon: 'icon-user', title: '用户信息', width: 720, height: 460 },
        columns: [[
            { field: 'ck', checkbox: true, width: 40 },
            //{field: 'privilege', title: '', width: 30},
            { field: 'deptname', title: '所属部门', width: 120, sortable: true },
            {
                field: 'name', title: '姓名', width: 90, sortable: true,
                formatter: function (value, row, index) {
                    return "<a href='#' onclick=\"userlist.editRecord('" + row.id + "')\">" + value + "</a>";
                }
            },
            { field: 'account', title: '登录账号', width: 120, sortable: true },
            { field: 'email', title: '电子邮箱', width: 200 },
            { field: 'mobile', title: '联系手机', width: 120 },
            {
                field: 'disabled', title: '用户状态', width: 60, align: 'center', formatter: function (value, row, index) {
                    if (value == 1)
                        return '<image src="../images/stop.png" title="停用"/>';
                }
            },
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    var randomkey = Math.random();
    treeForm = new treeForm('ulDeptTree', {
        createOption: {
            button: '#btnNewDepartment,#mmbtnNewDepartment', url:'/Admin/DepartmentManager.html', icon: 'icon-orgnization', title: '部门管理', width: 600, height: 300, beforeFunc: function (option) {
                var keyValue = treeForm.selectedNode() != null ? treeForm.selectedNode().id : '';
                option.url = option.url + '&pid=' + keyValue;
                return true;
            },
            closeFunc: function (result) { updateDepartment(result); }
        },
        deleteOption: {
            button: '#btnDeleteDepartment,#mmbtnDeleteDepartment', url:  '/department', beforeFunc: function () {
                if ($.isNullOrEmpty(treeForm.selectedKeyValue())) {
                    $.messager.alert('提示', '你不能删除根节点!', 'info');
                    return false;
                }
                return true;
            }
        },
        editOption: { button: '#btnEditDepartment,#mmbtnEditDepartment', url:  '/Admin/DepartmentManager.html', icon: 'icon-orgnization', title: '部门管理', width: 600, height: 300 },
        url: '/department',
        method:'GET',
        dnd: true,
        onDragEnter: function (target, source) {
            var targetNode = treeForm.getNode(target);
            var sourceParent =treeForm.getParent(source.target);
            return sourceParent.id != targetNode.id && targetNode != null;
        },
        onDrop: function (target, source, point) {
            var targetNode = treeForm.getNode(target);
            ApiCaller.Put({url:'/department/'+source.id+'/changeheader',data:{parentid:targetNode.id}});
            //$.post('DepartmentManager.aspx?action=ResetParentID', { sourceId: source.id, targetId: targetNode.id });
        },
        onBeforeDrag: function (node) {
            return node.id != '';
        },
        onCollapse:
            function (node) {
                treeForm.updateNode(node,{
                    target: node.target,
                    iconCls: 'icon-folderClose'
                })
            },
        onExpand: function (node) {
            treeForm.updateNode(node, {
                target: node.target,
                iconCls: 'icon-folder'
            })
        },
        onSelectChanged: function (node) {
            userlist.loadData({dept_id: node.id });
        },
        onContextMenu: function (e, node) {
            e.preventDefault();
            $(this).tree('select', node.target);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        }
    });
    InitUserGrid();
});


function reloadUser() {
    userlist.reload();
}


function resetPassword() {
    var userKeys = userlist.selectedKeyValue();
    if ($.isNullOrEmpty(userKeys)) {
        return $.messager.alert('提示', '请选择一个用户.', '');
    }
    dataForm.postAction({
        confirm: true,
        confirmMessage: '确认要重置选中用户的密码吗?',
        url: urlConfig.ApiUrl.userApi.Reset+userKeys,successMessage: '密码已成功重置为初始密码【123456】!',
    });
}
////停用或启用账号
function setUserEnableStatus(disble) {
    var userKeys = userlist.selectedKeyValue();
    if ($.isNullOrEmpty(userKeys)) {
        return $.messager.alert('提示', '请选择一个用户操作.', '');
    }
    var message = '确认要' + (disble==1? '停用':'启用') + '选中的用户吗?'
    dataForm.doAction({
        method:'post',
        confirm: true,
        confirmMessage: message,
        url: urlConfig.ApiUrl.userApi.Disable+userKeys, data: { disable:disble}, successFunc: function (result) {
            reloadUser();
        }
    });
}

///新增目录或更新目录后需要刷新
function updateDepartment(result) {
        var node = treeForm.selectedNode();
        if (!node) node=treeForm.getRoot(true);
        treeForm.appendNode(          
                [{
                id: result.id,
                text: result.text,
                iconCls: 'icon-folderClose'
            }],node);
        treeForm.updateNode({ target: node.target, iconCls: 'icon-folder' }, node);
        reloadUser();
}

function exportUser() {
    userlist.exportFile('users', 'user.xls');
}
function importUser() {
    dialogHelper.showModal({ title: '数据导入', url: '/Admin/ImportExcel.aspx?key=user', width: 700, height: 450, closeFunc: reloadUser(), icon: 'icon-import' });

}
function exportDepartment() {
    var paramurl = 'DepartmentManager.aspx?action=ExportExcel&exportKey=department';
    $.fileDownload(paramurl);
}

function appendTreeNode(treeNode) {
    if (treeNode != null) {
        var node = $('#ulDeptTree').tree('getSelected');
        $('#ulDeptTree').tree('append', {
            parent: (node ? node.target : null),
            data: treeNode
        });
    }

}

