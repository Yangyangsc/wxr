var detailForm;
$(document).ready(function () {
    imgLogo = new uploader('imgLogo', {
        fileKey: 'kolimage',
        refControl: {
            contentControl: 'kolHead',
            imageControl: 'imgLogo'
        }
    });
    detailForm = new detailForm('formKol', {
        bindOption: {
            url: '/kol/'
        },
        saveOption: {
            button: '#lnkSave',
            url: '/kol',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadKOL');
                    $.redirect('koldetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                } else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
})