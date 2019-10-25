var detailForm,imgLogo,imgQr;
$(document).ready(function () {
    imgLogo= new uploader('imgLogo',{fileKey:'groupimage',refControl:{contentControl:'groupLogo',imageControl:'imgLogo'}});
    imgQR= new uploader('imgQrcode',{fileKey:'groupimage',refControl:{contentControl:'groupcode',imageControl:'imgQrcode'}});
    $('#selType').combobox({onChange: switchType});
    detailForm = new detailForm('formGroup', {
        initForm:function(){$(".wechat").fadeOut();},
        bindOption: {
            url: '/socialgroup/', successFunc: function (result) {
                switchType(result.type);
                if (!$.isNullOrEmpty(result.image))
                    $('#imgLogo').attr('src', urlConfig.base.imageBase + result.image);
                if (!$.isNullOrEmpty(result.Qrcode))
                    $('#imgQrcode').attr('src', urlConfig.base.imageBase + result.Qrcode);
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/socialgroup',
            successFunc: function (result) {dialogHelper.closeModal(result);}
        }
    });
    detailForm.bindForm();
});

function switchType(newValue){
    if (newValue=="2")
        $(".wechat").fadeIn();
    else
        $(".wechat").fadeOut();
}
