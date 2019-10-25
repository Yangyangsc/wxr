var detailForm, rolelistForm,imgHeader;
var dgUserRoleLoaded, dgPrevilegeLoaded;
$(document).ready(function () {
    $('#tabPersonal').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitUserRoleGrid(); break;
                //case 2: InitPrivilege(); break;
            }
        }
    });
    $("input",$("#loginid").next("span")).blur(validatorloginName);
    formHelper.initializePopup();
    imgHeader= new uploader('imgHead',{fileKey:'userheader',refControl:{contentControl:'userHead',imageControl:'imgHead'}});
    detailForm = new detailForm('formUser', {
        initForm:function(){
            $('#deptname').textbox('setValue',$.getUrlParam('deptname')); 
            $('#deptname').textbox('validate');
            $('#deptid').val($.getUrlParam('deptUid'));
            $('#tabPersonal').tabs('close', 1);
        },
        bindOption: {
            url: '/user/', successFunc: function (result) {
                $("#loginid").attr("readonly","readonly");
                if (!$.isNullOrEmpty(result.image))
                    $('#imgHead').attr('src', urlConfig.base.imageBase + result.image);
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/user',
            beforeFunc: function () {
                if (loginIdExistFlag) {
                    $.messager.alert('提示', '用户的登录帐号重复，请重新输入.', 'info');
                    return false;
                }
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadUser');
                    $.redirect('UserDetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
})

function uploadSuccess(file, serverData) {
    var filename = $.getFilename(serverData);
    $('#userHead').val( filename);
    $('#imgHead').attr('src', urlConfig.staticfiles.images.userhead + filename);
}
function selectComplete() {
    swfu.startUpload();
}
///初始化列表控件
function InitUserRoleGrid() {
    if (rolelistForm != null) return;
    rolelistForm = new listForm('dgRoles', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveRole', url: '/userrole/',successFunc: function () {
                rolelistForm.removeRow();
            }
        },
        iconCls: 'icon-edit',
        url: '/user/roles/' + detailForm.getCurrentKey(),
        idField: 'id',
        toolbar: '#tools_1',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'name', title: '角色名称', width: 300 }
        ]]
    });
}

function addRoles() {
    formHelper.popupSelect({ url: '../CommonSelect/CommonSelector.html?user_id='+detailForm.getCurrentKey(), title: '分配角色', datakey: 'addrole', multiselect: true, width: 450, height: 530, afterSelectFunc: cs_SelectRoles, icon: 'icon-role' });
}

function cs_SelectRoles(itemData) {
    if (itemData && itemData.length>0) {
        var roleKeys = '';
        for (var nItem of itemData) {
            roleKeys=roleKeys+nItem.id+',';
        }
        if (roleKeys.length<=0) return;
        roleKeys = roleKeys.substr(0,roleKeys.length-1);
        var url = '/userrole';
        ApiCaller.Post({url:url,data:{user_id:detailForm.getCurrentKey(),role_id:roleKeys},
                        successFunc:function (result) {
                            var nIndex=0;
                            for (var nItem of itemData) {
                                rolelistForm.appendRow({ id: result.records[nIndex++], name: nItem.name });
                            }
        }});
    }
}
var loginIdExistFlag = false;
function validatorloginName() {
    var loginName = $('#loginid').val();
    if ($.trim(loginName) == '') return;
    ApiCaller.Post({url:'/user/checkaccount',data:{account:loginName},
        successFunc:function (result) {
        if (result.successed && !result.existed) {
            $('#errormessage').html("<img src='../images/ticked.png'/><font color='green'>账号可用</font>");
            loginIdExistFlag = false;
        }
        else {
            $('#errormessage').html("<img src='../images/no.png'/><font color='red'>账号重复</font>");
            loginIdExistFlag = true;
        }
    }});
}
