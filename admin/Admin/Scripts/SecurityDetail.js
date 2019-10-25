var dgUserRoleLoaded;
var detailForm, listSetting;
$(document).ready(function () {
    $('#tabPersonal').tabs({
        tabWidth: 130,
        tabHeight: 40,
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitSettingGrid(); break;
            }
        }
    });
    detailForm = new detailForm('aspnetForm', {
        bindOption: { url: rootVirtual + '/Admin/SecurityDetail.aspx?datakey=security' },
        saveOption: {
            button: '#lnkSave', url: rootVirtual + '/Admin/SecurityDetail.aspx?datakey=security',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    // dialogHelper.callParentFunc('reloadRoles');
                    dialogHelper.callbackFunc('reload');
                    $.redirect('SecurityDetail.aspx?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    if (detailForm.getCurrentAction() == 'addnew') {
        $('#tabPersonal').tabs('close', 1);
    }
    else
        detailForm.bindForm();
});
///初始化权限设置列表
function InitSettingGrid() {
    if (listSetting) return;
    listSetting = new listForm('dgSetting', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: 'SecurityDetail.aspx?action=GetObjectSetting&key=' + ObjUid,
        idField: 'SET_UID',
        doubleClickEdit:true,
        editOption: { url: rootVirtual + '/Admin/SecuritySettingDetail.aspx', icon: 'icon-settings', title: '安全对象权限设置', width: 700, height: 400 },
        deleteOption: {
            button: '#btnDeleteSetting', url: rootVirtual + '/Admin/SecurityDetail.aspx', action: 'DeleteSetting',beforeFunc: function (option) {
                option.value.setUid = option.value.key;
                return true;
            },
            successFunc: function (result) {
                listSetting.removeRow();
            }
        },
        toolbar: '#tools_1',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
           { field: 'USERNAME', title: '用户名称', width: 80 },
            { field: 'ROLENAME', title: '角色名称', width: 100 },
            {
                field: 'SET_ACCESS', title: '访问权限', width: 60, align: 'center', formatter: function (value, row, index) {
                    if  ((row.SET_ACCESS & 0x1)>0)
                        return "<img src='../images/delete.png'/>";
                    else if ((row.SET_ACCESS & 0x2) > 0)
                        return "<img src='../images/ticked.png'/>";
                }
            },
            {
                field: 'SET_FILTER', title: '数据过滤', width: 120,  formatter: function (value, row, index) {
                    if (row.SET_FILTER == 0)
                        return "自己的数据";
                    else if (row.SET_FILTER == 1)
                        return "本部门数据";
                    else if (row.SET_FILTER == 2)
                        return '<span title="' + row.SET_CUSTOM_FILTER + '">自定义过滤器</span>';
                    else return "无过滤";
                }
            },
             { field: 'SET_DISABLE_CONTROL', title: '禁用控件', width: 120},
             { field: 'SET_UNVISIBLE_CONTROL', title: '禁视控件', width: 120},
             { field: 'SET_USEABLE_CONTROL', title: '可用控件', width: 120 }
        ]]
    });
}

function addSetting() {
    formHelper.popupSelect({ url: '../CommonSelect/CommonSelector.aspx', title: '分配角色', datakey: 'SelectRolesAndUser', multiselect: true, width: 450, height: 530, afterSelectFunc: cs_SelectRoles, icon: 'icon-role' });
}

function cs_SelectRoles(itemData) {
    if (itemData) {
        if (itemData.length <= 0) return;
        var roleKeys = '', userKeys = '';
        for (var index = 0; index < itemData.length; index++) {
            roleKeys = roleKeys + (itemData[index].TYPE == 0 ? "0" : itemData[index].ID) + ",";
            userKeys = userKeys + (itemData[index].TYPE == 0 ? itemData[index].ID : "0") + ",";
        }
        var url = 'SecurityDetail.aspx?action=AddSetting';

        dataForm.postAction({
            url: 'SecurityDetail.aspx', action: 'AddSetting', prompt: false, value: { objUid: detailForm.getCurrentKey(), roleUid: roleKeys, userUid: userKeys },
            successFunc: function (result) {
                listSetting.reload();
            }
        });
    }
}
