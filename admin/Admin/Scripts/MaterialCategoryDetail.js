var detailForm, listRecommend;
$(document).ready(function () {
    $('#tabMenu').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitRecommend(); break;
            }
        }
    });
    detailForm = new detailForm('aspnetForm', {
        bindOption: {
            url: rootVirtual + '/Admin/MaterialCategoryDetail.aspx?datakey=materialcategory', successFunc: function (result) {
                if (result.icon)
                    $('#icon').attr('src', '../images/materialcategory/'+result.icon);
                else
                    $('#icon').hide();
            }
        },
        saveOption: {
            button: '#lnkSave', url: rootVirtual + '/Admin/MaterialCategoryDetail.aspx?datakey=materialcategory',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callbackFunc('reload');
                    dialogHelper.closeModal(result);
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    if (detailForm.getCurrentAction() == 'addnew') {
        $('#parentuid').val($.getUrlParam('parentUid'));
        $('#tabMenu').tabs('close', 1);
    }
    else
        detailForm.bindForm();
})

//初始化列表控件

function uploadSuccess(file, serverData) {
    var filename = $.getFilename(serverData);
    $('#icon').show();
    $('#hideicon').val(filename);
    $('#icon').attr('src', '../images/materialcategory/' + filename);
}

function addRecommend() {
    formHelper.popupSelect({ url: '../CommonSelect/CommonSelector.aspx', title: '选择食材', datakey: 'SelectMaterials', multiselect: true, width: 600, height: 530, afterSelectFunc: cs_SelectRecommend, icon: 'icon-role' });
}
function cs_SelectRecommend(itemData) {
    if (itemData) {
        if (itemData.length <= 0) return;
        var materialKeys = '';
        for (var index = 0; index < itemData.length; index++) {
            materialKeys = materialKeys +itemData[index].MATERIAL_UID + ",";
        }
        dataForm.postAction({
            url: 'MaterialCategoryDetail.aspx', action: 'AddRecommend', prompt: false, value: { cateUid: detailForm.getCurrentKey(), materialUid: materialKeys },
            successFunc: function (result) {
                listRecommend.reload();
            }
        });
    }
}

function InitRecommend() {
    if (listRecommend != null) return;
    listRecommend = new listForm('dgRecommend', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveRecommend', url: rootVirtual + '/Admin/MaterialCategoryDetail.aspx', action: 'DeleteRecommend', successFunc: function () {
                listRecommend.reload();
            }
        },
        iconCls: 'icon-edit',
        url: '/Admin/MaterialCategoryDetail.aspx?action=GetRecommend&key=' + detailForm.getCurrentKey(),
        idField: 'KEY_UID',
        toolbar: '#tools_1',
        pagination: false,
        singleSelect: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'PROVIDER_NAME', title: '供应商', width: 150 },
            { field: 'MATERIAL_NAME', title: '食材名称', width: 150 }
        ]]
    });
}