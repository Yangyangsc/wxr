var detailForm, imgPoster, imgShare, imgLogo;
var _userToken = ApiCaller.getUser().token;
$(document).ready(function () {
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
    detailForm = new detailForm('formMember', {
        initForm: function () {
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
                    // response.rows.unshift({
                    //     id: '',
                    //     topic: '请选择活动名称'
                    // });
                    formHelper.bindCombo({
                        combobox: 'comBusiness',
                        data: response.rows,
                        valueField: 'id',
                        textField: 'topic'
                    });
                }
            });
        },
        bindOption: {
            url: '/activity',
            successFunc: function (result) {
                console.log("bindOption")
            }
        },
        saveOption: {
            button: '#lnkSave',
            url: '/game_rule',
            beforeFunc: function (result) {
                // if (keyExistFlag) {
                //     $.messager.alert('提示', '轮播关键字用于前端调用，不能重复.', 'info');
                //     return false;
                // }
                return true;
            },
            successFunc: function (result) {
                dialogHelper.closeModal(result);
            }
        }
    });
    detailForm.bindForm();
});