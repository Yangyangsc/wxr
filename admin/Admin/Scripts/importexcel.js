var listForm;
function uploadSuccess(file, serverData) {
    dataForm.postAction({
        url: 'importExcel.aspx', action: 'ReadUserFile', value: { filename: serverData },
        successFunc: function (data) {
            $('#dgUser').datagrid('loadData', data);
        }
    });
}
$(document).ready(function () { InitUserGrid(); });
function startUpload() {
    swfu.startUpload();
}

function startImport() {
    var immportedUser = $('#dgUser').datagrid('getChecked');
    if (immportedUser.length <= 0) {
        $.messager.alert('提示', '请选择需要导入的用户', 'info');
        return;
    }
    var selectedUser='';
    for (var userIndex = 0; userIndex < immportedUser.length; userIndex++) {
        var itemData = immportedUser[userIndex];
        selectedUser = selectedUser + '|' + itemData.id + '|';
    }
    dataForm.postAction({url:'importExcel.aspx',action:'ImportUserData',value:{ useridlist: selectedUser },
        successMessage:'数据导入成功!',
        successFunc:function (data) {
            dialogHelper.closeModal(data);
        }});
}
///初始化列表控件
function InitUserGrid() {
    listForm = new listForm('dgUser',{
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        // url: 'importExcel.aspx?action=GetImportUser&filename=' + escape(importFile),
        loadMsg: '数据加载中...',
        idField: 'id',
        fit: true,
        singleSelect: false,
        rownumbers: true,//行号 
        pagination: false,
        onCheck: function (rowIndex, rowData) {
            if (rowData.error == 1) $('#dgUser').datagrid('uncheckRow', rowIndex);
        },
        onCheckAll: function (rows) {
            for (var index = 0; index < rows.length; index++) {
                if (rows[index].error == 1) $('#dgUser').datagrid('uncheckRow', index);
            }
        },
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'deptname', title: '部门名称', width: 100 },
            { field: 'name', title: '用户名', width: 80 },
            {
                field: 'loginid', title: '登录账号', width: 80, formatter: function (value, row, index) {
                    if (row.error == 1)
                        return '<img src="../images/no.png" title="账号重复，不可导入">' + row.loginid;
                    return row.loginid;
                }
            },
            { field: 'email', title: '电子邮箱', width: 120 },
            { field: 'mobile', title: '手机号码', width: 80 }
        ]]
    });
}