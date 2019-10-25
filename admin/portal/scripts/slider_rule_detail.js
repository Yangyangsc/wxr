var listImages;
var detailForm;
var _userToken = ApiCaller.getUser().token;
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

    $.ajax({
        type: "get",
        url: "http://adminapi.huanxinkeji.cn/activity",
        data: {
            page: 1,
            rows: 50000,
            access_token: _userToken
        },
        dataType: "json",
        success: function (response) {
            formHelper.bindCombo({
                combobox: 'comBusiness',
                data: response.rows,
                valueField: 'id',
                textField: 'topic'
            });
        }
    });

    var ue = UE.getEditor('editor', {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        enableAutoSave: false,
        elementPathEnabled: false,
        wordCount: false,
        toolbars: [
            ['fullscreen', 'source', 'undo', 'redo'],
            ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
        ]
    });

    detailForm = new detailForm('formSlider', {
        initForm: function () {
            $('#tabSlider').tabs('close', 1);
        },
        bindOption: {
            url: '/game_rule',
            successFunc: function (result) {
                $("#keyInput").attr("readonly", "readonly");
                if (!$.isNullOrEmpty(result.rule)) setTimeout(function () {
                    ue.setContent(result.rule);
                }, 500);
            }
        },
        saveOption: {
            button: '#lnkSave',
            url: '/game_rule',
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
                    $.redirect('slider_question_detail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                } else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
});