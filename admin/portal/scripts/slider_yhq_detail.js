var listImages;
var detailForm;
$(document).ready(function () {
    $('#tabSlider').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1:
                    InitImageGrid();
                    break;
            }
        }
    });


    $("input", $("#keyInput").next("span")).blur(validateKeyExist);
    detailForm = new detailForm('formSlider', {
        initForm: function () {
            $('#tabSlider').tabs('close', 1);
        },
        bindOption: {
            url: '/getuser',
            successFunc: function (result) {
                result.yhq.unshift({
                    id: '',
                    yhq: '请选择优惠券'
                });
                formHelper.bindCombo({
                    combobox: 'comBusiness',
                    data: result.yhq,
                    valueField: 'id',
                    textField: 'yhq'
                });
                $("#keyInput").attr("readonly", "readonly");
            }
        },
        saveOption: {
            button: '#lnkSave',
            url: '/getuser',
            beforeFunc: function () {
                // if (keyExistFlag) {
                //     $.messager.alert('提示', '轮播关键字用于前端调用，不能重复.', 'info');
                //     return false;
                // }
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callbackFunc('reload');
                    $.redirect('slider_yhq_detail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                } else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
});

////停用或启用账号
function setImageEnableStatus(disble) {
    var itemKeys = listImages.selectedKeyValue();
    if ($.isNullOrEmpty(itemKeys)) {
        return $.messager.alert('提示', '请选择一个图片操作.', '');
    }
    var message = '确认要' + (disble == 1 ? '停用' : '启用') + '选中的轮播图吗?';
    $.messager.confirm('提示', message, function (r) {
        if (r) {
            ApiCaller.Put({
                url: 'sliderimage/' + itemKeys + '/setstatus',
                data: {
                    disabled: disble
                },
                successFunc: function (result) {
                    listImages.reload();
                }
            });
        }
    });
}
///验证Key的重复性
var keyExistFlag = false;

function validateKeyExist() {
    var keyValue = $('#keyInput').val();
    ApiCaller.Get({
        url: 'getuser/checkkey',
        data: {
            key: keyValue,
            id: detailForm.getCurrentKey()
        },
        successFunc: function (result) {
            if (result.successed && !result.existed) {
                $('#errormessage').html("<img src='../images/ticked.png'/><font color='green'></font>");
                keyExistFlag = false;
            } else {
                $('#errormessage').html("<img src='../images/no.png'/><font color='red'>关键字重复</font>");
                keyExistFlag = true;
            }
        }
    });
}