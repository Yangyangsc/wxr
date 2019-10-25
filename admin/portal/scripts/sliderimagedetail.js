var detailForm,sliderUploader;
$(document).ready(function () {
    sliderUploader= new uploader('sliderImage',{fileKey:'slider',refControl:{contentControl:'hideImage',imageControl:'sliderImage'}});
    detailForm = new detailForm('formSlider', {
        bindOption: {
            url: '/sliderimage', successFunc: function (result) {
                if (result.image)  $('#sliderImage').attr('src', urlConfig.base.imageBase +result.image);
            }},
        saveOption: {
            button: '#lnkSave', url: '/sliderimage',
            beforeFunc:function(option){
                if ($('#hideImage').val().length<=0){
                    $.messager.alert('图片','请上传轮播图片','error');
                    return false;
                }
                return true;
            },
            successFunc: function (result) {
                    dialogHelper.callbackFunc('reload');
                    dialogHelper.closeModal(result);
            }
        }
    });
    detailForm.bindForm();
})
