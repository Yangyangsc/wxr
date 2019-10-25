var detailForm,imgPoster,imgShare;
$(document).ready(function () {
    detailForm = new detailForm('formMember', {
        initForm:function(){initColorPicker('#004cb5');},
        bindOption: {
            url: '/question/', successFunc: function (result) {
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/question',
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