var detailForm;
$(document).ready(function () {
    $.bindMemberType2Combox({combobox:'selMembers',multiple:false,firstItem:{id:'',text:'-请选择-'}});
    $('#selforever').combobox({onChange: disableDateSelect});
    detailForm = new detailForm('formUserMember', {
        initForm:function(){$('.guide').hide()},
        bindOption: {url: '/member/usermember/',successFunc:function(result){
             disableDateSelect(result.forever)
             if($.isNullOrEmpty(result.guidename)) $('.guide').hide();
        }},
        saveOption: {
            button: '#lnkSave', url: '/member/usermember',
            beforeFunc:function(option){
                var member = $('#selMembers').combobox('getValue');
                if (member==''){
                    $.messager.alert('提示','请选择入会的类型','error');
                    return false;
                }
                return true;
            },
            successFunc: function (result) {dialogHelper.closeModal(result);}
        }
    });
    detailForm.bindForm();
});
function disableDateSelect(permanent){
    if (permanent==0)
        $('.memberdate').fadeIn();
    else
        $('.memberdate').fadeOut();
}