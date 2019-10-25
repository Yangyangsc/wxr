var detailForm,imgPoster,imgShare;
$(document).ready(function () {
    imgPoster= new uploader('imgPoster',{fileKey:'membertype',refControl:{contentControl:'memberPoster',imageControl:'imgPoster'}});
    imgShare= new uploader('imgShare',{fileKey:'membertype',refControl:{contentControl:'memberShare',imageControl:'imgShare'}});
    // $.bindMemberType2Combox('selMemberType',true);
    detailForm = new detailForm('formMember', {
        initForm:function(){initColorPicker('#004cb5');},
        bindOption: {
            url: '/membertype/', successFunc: function (result) {
                if (!$.isNullOrEmpty(result.buttoncolor)){
                        $('#buttoncolor').val(result.buttoncolor);
                        initColorPicker(result.buttoncolor);
                    }
                else
                    initColorPicker('#004cb5');
                if (!$.isNullOrEmpty(result.poster))
                    $('#imgPoster').attr('src', urlConfig.base.imageBase + result.poster);
                if (!$.isNullOrEmpty(result.shareimage))
                    $('#imgShare').attr('src', urlConfig.base.imageBase + result.shareimage);
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/membertype',
            successFunc: function (result) {dialogHelper.closeModal(result);}
        }
    });
    detailForm.bindForm();
});

function initColorPicker(defColor){
            $('#buttoncolor').minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue:defColor,
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function(hex, opacity) {
                    var log;
                    try {
                        log = hex ? hex : 'transparent';
                        if( opacity ) log += ', ' + opacity;
                        console.log(log);
                    } catch(e) {}
                },
                theme: 'default'
            });
        }