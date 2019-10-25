
//备餐完成
function SelectLogitics() {
    formHelper.popupSelect({
        title: '请选择物流人员',
        datakey: 'SelectLogticUser', width: 400, height: 550,
        afterSelectFunc: function (data) {
            
            $("#logiticname").val(data.NAME);
            $("#hidLogitics").val(data.ID);
        }
    });
}

function SelectLocation() {
    var name, lat, lng, locParam;
    name = $('#signname').val();
    lat = parseFloat($('#lat').val());
    lng = parseFloat($('#lon').val());
    var fullUrl = rootVirtual + '/Admin/SetGeoLocation.aspx';
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        locParam = 'lat=' + lat + '&lng=' + lng;
    }
    
    if (name) {
        fullUrl += '?name=' + name;
        if (locParam) {
            fullUrl += '&' + locParam;
            }
    } else if (locParam) {
        fullUrl += '?' + locParam;
    }    
    
    dialogHelper.showModal({
        title: '获取位置信息',
        url: fullUrl,
        width: 600,
        height: 500,
        icon: 'icon-import',
        closeFunc: function (result, param) {
            if (result.location) {
                var locJSON = JSON.parse(result.location);
                $('#lat').val(locJSON.lat);
                $('#lon').val(locJSON.lng);
            }
        }
    });
}

var detailForm, rolelistForm;
var dgUserRoleLoaded, dgPrevilegeLoaded;
$(function () {
    $('#tabPersonal').tabs({
        tabWidth: 130,
        tabHeight: 40,
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitUserRoleGrid(); break;
                    //case 2: InitPrivilege(); break;
            }
        }
    });
 
    $('#areaname').val($.getUrlParam('areaname')); //'<%=HttpUtility.UrlDecode(Request.QueryString["deptname"]+"")%>');
    $('#areaname').validatebox('validate');
    $('#areaUid').val(areaUid);
    //alert(areaUid);

    formHelper.initializePopup();
    detailForm = new detailForm('aspnetForm', {
        bindOption: {
            url: rootVirtual + '/Admin/TradeAreaDetail.aspx?datakey=sign_info', successFunc: function (result) {
                //debugger
                //if (!$.isNullOrEmpty(result.picture))
                //    $('#imgHead').attr('src', '../images/userhead/' + result.picture);
                //else {
                //    $('#imgHead').attr('src', '../images/userhead/userhead.png');
                //}
            }
        },
        saveOption: {
            button: '#lnkSave', url: rootVirtual + '/Admin/TradeAreaDetail.aspx?datakey=sign_info',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadTradeArea');
                    $.redirect('TradeAreaDetail.aspx?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                dialogHelper.closeModal(result);
            },
            failFunc: function (result) {
                if (result.extInfo == "over") {
                    $.messager.alert('失败', '用户数量已超过系统允许的用户数量，请联系管理员!', 'error');
                }
            }
        }
    });
    if (detailForm.getCurrentAction() == 'addnew') {
     
        $('#tabPersonal').tabs('close', 1);
    }
    else
        detailForm.bindForm();
})

function uploadSuccess(file, serverData) {
    var filename = $.getFilename(serverData);
    $('#userHead').val(filename);
    $('#imgHead').attr('src', '../images/userhead/' + filename);
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
            button: '#lnkRemoveRole', url: rootVirtual + '/Admin/UserDetail.aspx', action: 'DeleteUserRole', beforeFunc: function (option) {
                option.value.roleUid = option.value.key;
                option.value.userUid = detailForm.getCurrentKey();
                return true;
            }, successFunc: function () {
                rolelistForm.removeRow();
            }
        },
        iconCls: 'icon-edit',
        url: '/Admin/UserDetail.aspx?action=GetUserRoles&key=' + detailForm.getCurrentKey(),
        idField: 'ROLE_UID',
        toolbar: '#tools_1',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'ROLE_NAME', title: '角色名称', width: 300 }
        ]]
    });
}

function addRoles() {
    formHelper.popupSelect({ url: '../CommonSelect/CommonSelector.aspx', title: '分配角色', datakey: 'SelectRoles', multiselect: true, width: 450, height: 530, afterSelectFunc: cs_SelectRoles, icon: 'icon-role' });
}

function cs_SelectRoles(itemData) {
    if (itemData) {
        var roleKeys = '';
        for (var nItem = 0; nItem < itemData.length; nItem++) {
            var selectedRow = rolelistForm.getRowIndex(itemData[nItem].ROLE_UID);
            if (selectedRow < 0) {
                roleKeys = roleKeys + itemData[nItem].ROLE_UID + ",";
            }
        }
        if (roleKeys == '') return;
        var url = 'UserDetail.aspx?action=AddRolesToUser';
        dataForm.postAction({
            url: 'UserDetail.aspx', action: 'AddRolesToUser', prompt: false, value: { roleUid: roleKeys, userUid: detailForm.getCurrentKey() },
            successFunc: function (result) {
                for (var nItem = 0; nItem < itemData.length; nItem++) {
                    var selectedRow = rolelistForm.getRowIndex(itemData[nItem].ROLE_UID);
                    if (selectedRow < 0) {
                        rolelistForm.appendRow({ ROLE_UID: itemData[nItem].ROLE_UID, ROLE_NAME: itemData[nItem].ROLE_NAME });
                    }
                }
            }
        });
    }
}
var loginIdExistFlag = false;
function validatorloginName() {
    var loginName = $('#loginid').val();
    if ($.trim(loginName) == '') return;
    $.post('UserDetail.aspx?action=ValidateLoginId', { loginid: loginName }, function (data) {
        var result = $.parseJSON(data);
        if (result.successed) {
            $('#errormessage').html("<img src='../images/ticked.png'/><font color='green'>账号可用</font>");
            loginIdExistFlag = false;
        }
        else {
            $('#errormessage').html("<img src='../images/no.png'/><font color='red'>账号重复</font>");
            loginIdExistFlag = true;
        }
    });
}

function changeUserName() {
    var firstName = $('#firstname').val();
    var lastName = $('#lastname').val();
    var fullname = $('#name').val();
    if (fullname == '' || (lastName + firstName).indexOf(fullname) >= 0) {
        $('#name').val(lastName + firstName);
    }
}