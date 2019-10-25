$(document).ready(function () {
    InitGrid();
    //$('#dgPrivilege').datagrid();
});

///将所选的权限绑定到详细列表上
function bindSetting(data) {
    var baseValue = 0x01;
    var allow = (data.SET_ACCESS & 0x2)>0;
    var forbid =(data.SET_ACCESS & 0x1)>0;
    $('#allowUse').attr("checked", allow);
    $('#forbidUse').attr("checked", forbid);
}
///获取列表中当前选择的用户
function getSelectedPrivilege() {
    var rowData = $('#dgRoles').datagrid('getSelected');
    return rowData;
}
///保存用户的权限设置
function Save() {
    var rowItem = getSelectedPrivilege();
    if (rowItem == null) {
        $.messager.alert('提示', '您尚未选择一个用户或角色进行修改！', 'info');
        return;
    }
    var priviValue = GetAccessValue();
    var url = 'SecuritySetting.aspx?action=UpdateSecuritySetting';
    $.post(url, {
        RecUid: rowItem.SET_UID,
        rightData: priviValue
    },
    function (data) {
        var result = $.parseJSON(data);
        if (result.successed) {
            var rowIndex=$('#dgRoles').datagrid('getRowIndex', rowItem);
            $('#dgRoles').datagrid('updateRow', {
                index: rowIndex,
                row: {
                    SET_UID: result.id,
                    OBJ_UID: objectUid,
                    USER_UID: rowItem.USER_UID,
                    USERNAME: rowItem.NAME,
                    ROLE_UID: rowItem.ROLE_UID,
                    ROLENAME: rowItem.ROLE_NAME,
                    SET_ACCESS: priviValue,
                    SET_FILTER: 0,
                    SET_FILTER_CUSTOM:''
                }
            });
            $.messager.alert('保存成功', '权限设置成功！', 'info');
        }
    }
    );
}
///删除一项
function DeletePrivilege() {
    var rowData = getSelectedPrivilege();
    if (rowData == null) {
        $.messager.alert('提示', '请选择一个用户或角色名称删除！', 'info');
        return;
    }
    $.messager.confirm('删除确认', '确认要删除文档对象对该用户角色的设置?', function (r) {
        if (r) {
            var url = "SecuritySetting.aspx?action=delete";
            $.post(url, { key: rowData.SET_UID }, function (result) {
                if (result) {
                    $('#dgRoles').datagrid('reload');
                }
                else {
                    $.messager.alert('Failed', '删除失败!', 'error');
                }
            });
        }
    });
}
function selectUserAndRoles() {
    formMethod.popupSelect({ title: '用户选择', datakey: 'SelectRolesAndUser', width: 500, height: 530, afterSelectFunc: cs_SelectUserAndRoles,icon:'icon-user' });
}

function GetAccessValue() {
    var fullValue = 0x00;
    if ($('#allowUse').attr("checked") == "checked") {
        fullValue = fullValue | 0x2;
    }
    if ($('#forbidUse').attr("checked") == "checked") {
        fullValue = fullValue | 0x1;
    }
   
    return fullValue;
}

function cs_SelectUserAndRoles(itemData) {
    if (itemData) {
        var url = 'SecuritySetting.aspx?action=AddUserRolesToObject';
        //alert(objectUid + ':' + itemData.TYPE + ':' + itemData.ID);
        $.post(url, {
            ItemUid: objectUid,
            Usertype: itemData.TYPE,
            userRoleUid: itemData.ID
        }, function (data) {
            var result = $.parseJSON(data);
            if (result.successed) {
                $('#dgRoles').datagrid('appendRow', {
                    SET_UID: result.id,
                    OBJ_UID: objectUid,
                    USER_UID: itemData.TYPE == 0 ? itemData.ID : '',
                    USERNAME: itemData.TYPE == 0 ? itemData.NAME : '',
                    ROLE_UID: itemData.TYPE == 1 ? itemData.ID : '',
                    ROLENAME: itemData.TYPE == 1 ? itemData.NAME : '',
                    SET_ACCESS: 0,
                    SET_FILTER: 0,
                    SET_CUSTOM_FILTER: ''
                });
                var rows = $('#dgRoles').datagrid('getRows');
                $('#dgRoles').datagrid('selectRow', rows.length - 1);
            }
        });

    }
}

function InitGrid() {
    var randomkey = Math.random();
    $('#dgRoles').datagrid({
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: 'SecuritySetting.aspx?action=list&datakey=securitysetting&key=' + objectUid + '&random=' + randomkey,
        loadMsg: '数据加载中...',
        idField: 'SET_UID',
        singleSelect: true,
        toolbar: '#tools_1',
        pagination: false,
        onLoadSuccess: function (data) {
            if (data && data.rows.length > 0) {
                $('#dgRoles').datagrid('selectRow', 0);
            }
            else {
                $('#allowUse,#forbidUse').attr("checked", false);
            }
        },
        onSelect: function (rowIndex, rowData) {
            bindSetting(rowData);
        },
        columns: [[
            //{ field: 'ck', checkbox: true },
            {
                field: 'SET_UID', title: '组或用户名', width: 150, formatter: function (value, row, index) {
                    ///单独用户的设置
                    if (row.USER_UID) {
                        return "<img src='../images/user.png'/>" + row.USERNAME;
                    }
                    if (row.ROLE_UID) {
                        return "<img src='../images/user_group.png'/>" + row.ROLENAME;
                    }
                }
            }
        ]]
    });
}