var dgPrevilegeLoaded, listUsers;
var detailForm;
$(document).ready(function () {
    $('#tabPersonal').tabs({
        tabWidth: 130,
        tabHeight: 40,
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitUserGrid(); break;
            }
        }
    });
    detailForm = new detailForm('formRole', {
        initForm:function(){
            $('#tabPersonal').tabs('close', 1);
        },
        bindOption: { url: '/roles' },
        saveOption: {
            button: '#lnkSave', url: '/roles',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    // dialogHelper.callParentFunc('reloadRoles');
                    dialogHelper.callbackFunc('reload');
                    $.redirect('RoleDetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
     detailForm.bindForm();
});
///初始化列表控件
function InitUserGrid() {
    if (listUsers) return;
    listUsers = new listForm('dgUsers', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/roles/' + detailForm.getCurrentKey()+'/users',
        idField: 'id',
        deleteOption: {
            button: '#btnDeleteUser', url: '/userrole',
            successFunc: function (result) {
                listUsers.removeRow();
            }
        },
        toolbar: '#tools_1',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'name', title: '用户', width: 300 }
        ]]
    });
}

function addUsers() {
    formHelper.popupSelect({ url: '../CommonSelect/CommonSelector.html?role_id='+detailForm.getCurrentKey(), title: '添加用户', datakey: 'addroleuser', multiselect: true, width: 500, height: 530, afterSelectFunc: cs_SelectUsers, icon: 'icon-user' });
}
function cs_SelectUsers(itemData) {
    if (itemData && itemData.length>0) {
        var userKeys = '';
        for (var nItem of itemData) {
            userKeys=userKeys+nItem.id+',';
        }
        if (userKeys == '') return;
        userKeys = userKeys.substr(0,userKeys.length-1);
        dataForm.postAction({
            url: '/userrole',prompt:false, data: { role_id: detailForm.getCurrentKey(), user_id: userKeys },
            successFunc: function (result) {
                var nIndex=0;
                for (var nItem of itemData) {
                    listUsers.appendRow({ id: result.records[nIndex++], name: nItem.name });
                }
            }
        });
    }
}