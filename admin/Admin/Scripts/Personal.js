var detailForm,imgHeader;
 var currentUser;
$(document).ready(function () {
    currentUser = ApiCaller.getUser();
    imgHeader= new uploader('imgHead',{fileKey:'userheader',refControl:{contentControl:'userHead',imageControl:'imgHead'}});
     detailForm = new detailForm('formUser', {
        itemkey:currentUser.id,
        bindOption: {
            url: '/user', successFunc: function (result) {
                if (!$.isNullOrEmpty(result.image))
                     $('#imgHead').attr('src', urlConfig.base.imageBase + result.image);

            }
        },
        saveOption: {
            button: '#lnkSave', url: '/user',
            successFunc: function (result) {
                dialogHelper.callParentFunc('reload');
                dialogHelper.closeModal(result);
            }
        }
    }); 
    detailForm.bindForm();
});
function isSafePassword(value) {
        return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test(value));
}
function checkPasswordInvalid(option) {
    var oldpassword = option.data.oldpassword,
        newpassword = option.data.newpassword;

    if (oldpassword=='') {
        $.messager.alert('错误', '请输入旧密码!', 'error');
        return false;
    }
    var cfmpsd = $('#passwordconfirm').val();
    if (newpassword.length < 6 || newpassword.length > 20 || !isSafePassword(newpassword)) {
        $.messager.alert('错误', '密码长度请介于6位到20位之间,且必须包含字母和数字!', 'error');
        return false;
    }
    if (cfmpsd!=newpassword) {
        $.messager.alert('错误', '请输入新密码或密码确认输入，并且保持一致!', 'error');
        return false;
    }
    if (oldpassword ==newpassword) {
        $.messager.alert('提示', '您的新密码和旧密码没有变化，请重新输入一个！', 'info');
        return false;
    }
    option.data.oldpassword =$.md5(oldpassword);
    option.data.newpassword =$.md5(newpassword);
    return true;
}
function ChangePassword() {
    dataForm.postAction({
        url: '/user/'+currentUser.id+'/changepassword', data: { oldpassword: $('#oldpassword').val(), newpassword: $('#newpassword').val() },
        beforeFunc:checkPasswordInvalid,
        successMessage: '密码修改成功', failMessage: '密码修改失败,旧密码输入错误!', successFunc: function () {
            if ($.getUrlParam('force')=='1')  dialogHelper.closeModal(true);
        }
    });
}