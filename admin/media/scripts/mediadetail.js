var detailForm, imgLogo;

$(document).ready(function () {
    initForm();
})
function initForm(){
    formHelper.initializePopup();
    imgLogo= new uploader('imgLogo',{fileKey:'mediaLogo',refControl:{contentControl:'mediaLogo',imageControl:'imgLogo'}});
    $('#selType').combobox({onChange: function(newValue){
        if (newValue>=2)
             $('.platform').show();
        else
             $('.platform').hide();
    }});
    detailForm = new detailForm('formMedia', {
        initForm:function(){
            $('#contentname').textbox('setValue',$.getUrlParam('catalogname')); 
            $('#contentname').textbox('validate');
            $('#contenttype').val($.getUrlParam('catalogid'));
            $('.platform').hide();
        },
        bindOption: {
            url: '/media/', successFunc: function (result) {
                if (!$.isNullOrEmpty(result.logo))
                    $('#imgLogo').attr('src', urlConfig.base.imageBase + result.logo);
                ///设置文章标签
                if(!$.isNullOrEmpty(result.label)){
                    $('#labelInput').tagbox('setValues',result.label.split(','));
                }
                if (result.type<2) $('.platform').hide();
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/media',
            beforeFunc:function(option){
                ///验证标签的数量不要多于6个
                var tags = $('#labelInput').tagbox('getValues');
                if (tags!=null && tags.length>6) {
                    $.messager.alert('提示','标签数量不要超过6个,不便于精准识别','info');
                    return false;
                }
                $('#realLabel').val(tags.join(','));
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadMedia');
                    $.redirect('mediadetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
}

