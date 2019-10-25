///初始化列表控件
var listSecurity;
function InitSecurityGrid() {
    var randomkey = Math.random();
    listSecurity = new listForm('dg',{
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: 'SecurityList.aspx?action=list&datakey=security&random=' + randomkey,
        idField: 'OBJ_UID',
        doubleClickEdit: true,
        toolbar: '#tools_1',
        rownumbers: true,//行号 
        searchOption: { searchButton: '#btnSearch', resetButton: '#btnReset' },
        createOption: { button: '#btnNewObject', url: rootVirtual + '/Admin/SecurityDetail.aspx', icon: 'icon-lock', title: '安全对象管理', width: 800, height: 470, callbackFunc: { reload: function () { listSecurity.reload(); } } },
        deleteOption: { button: '#btnDeleteObject', url: rootVirtual + '/Admin/SecurityList.aspx' },
        editOption: { url: rootVirtual + '/Admin/SecurityDetail.aspx', icon: 'icon-lock', title: '安全对象管理', width: 800, height: 470 },
        columns: [[
            //{ field: 'ck', checkbox: true },
             {
                 field: 'OBJ_NAME', title: '对象名称', width: 150, sortable: true, formatter: function (value, row, index) {
                     return "<a href='#' onclick=\"listSecurity.editRecord('" + row.OBJ_UID + "')\">" + row.OBJ_NAME + "</a>";
                 }
             },
            { field: 'OBJ_TYPE', title: '对象类型', width: 300, sortable: true },
             {
                 field: 'OBJ_ENABLED', title: '启用状态', width: 80,align:'center', sortable: true, formatter: function (value, row, index) {
                     if (value == 0)
                         return '<image src="../images/stop.png" title="停用"/>';
                 }
             }
        ]]
    });
}

////停用或启用账号
function setObjectEnableStatus(enable) {
    var key = listSecurity.selectedKeyValue();
    if ($.isNullOrEmpty(key)) {
        $.messager.alert('提示', '请选择一条记录.', '');
        return;
    }
    var message = '确认要' + (enable == 0 ? '停用' : '启用') + '选中的记录吗?'
    dataForm.doAction({
        method: 'post',
        confirm: true,
        confirmMessage: message,
        url: 'SecurityList.aspx', action: 'SetObjectEnable', value: { action: enable, key: key }, successFunc: function (result) {
            listSecurity.reload();
        }
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    ///初始化表格
    InitSecurityGrid();

});

