var detailForm;
var uploadPictures, imgProduct, imgProduct1, imgProduct2;
$(document).ready(function () {
    $('#tabProduct').tabs({
        onSelect: function (title, index) {
            switch (index) {
                //case 1: InitProductImages(); break;
            }
        }
    });
    var ue = UE.getEditor('editor', {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        enableAutoSave: false,
        elementPathEnabled: false,
        wordCount: false
    });
    formHelper.initializePopup();
    imgProduct = new uploader('imgProduct', {
        fileKey: 'product',
        refControl: {
            contentControl: 'productImage',
            imageControl: 'imgProduct'
        }
    });
    imgProduct1 = new uploader('imgProduct1', {
        fileKey: 'product',
        refControl: {
            contentControl: 'productImage1',
            imageControl: 'imgProduct1'
        }
    });
    imgProduct2 = new uploader('imgProduct2', {
        fileKey: 'product',
        refControl: {
            contentControl: 'productImage2',
            imageControl: 'imgProduct2'
        }
    });
    $('#selLimitType').combobox({
        onChange: switchStock
    });
    detailForm = new detailForm('formProduct', {
        initForm: function () {
            if (!$.isNullOrEmpty($.getUrlParam('catalogid'))) {
                $('#catalogname').textbox('setValue', $.getUrlParam('catalogname')).validatebox('validate');
                $('#catalogid').val($.getUrlParam('catalogid'));
            }
        },
        bindOption: {
            url: '/product',
            successFunc: function (result) {
                if (!$.isNullOrEmpty(result.richtext)) setTimeout(function () {
                    ue.setContent(result.richtext);
                }, 500);
                if (!$.isNullOrEmpty(result.image))
                    $('#imgProduct').attr('src', urlConfig.base.imageBase + result.image);
                if (!$.isNullOrEmpty(result.image1))
                    $('#imgProduct1').attr('src', urlConfig.base.imageBase + result.image1);
                if (!$.isNullOrEmpty(result.image2))
                    $('#imgProduct2').attr('src', urlConfig.base.imageBase + result.image2);
                switchStock(result.limittype);
            }
        },
        saveOption: {
            button: '#lnkSave',
            url: '/product',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callbackFunc('reload');
                    $.redirect('productdetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                } else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
    //uploadPictures= new uploader('addPictures',{fileKey:'productpicture',data:{data_id:detailForm.getCurrentKey(),bus_type:2},multiUpload:true,successFunc:pictureUploaded});
});

function pictureUploaded(imgValue) {
    appendImage(imgValue.id, imgValue.path);
}

function removeImage(index) {
    var imgIndex = $.isNullOrEmpty(index) ? '' : index;
    $('#imgProduct' + imgIndex).attr('src', '../images/default_product.png');
    $('#productImage2' + imgIndex).val('');
}

function appendImage(imgId, imgUrl) {
    $('#productPictures').append('<li id="li_' + imgId + '"><a href="#" class="item" style=""><img src="' + urlConfig.base.imageBase + imgUrl + '" onclick="formHelper.directViewImage(this,650,600)"></a>' +
        '<div><a href="#" id="' + imgId + '" onclick="removeItem(this)" class="easyui-linkbutton l-btn l-btn-small l-btn-plain" data-options="plain:true,iconCls:\'icon-delete\'" ' +
        'group=""><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">删除</span><span class="l-btn-icon icon-delete">&nbsp;</span></span></a></div></li>');
}

function dealPriceEq(discount) {
    $('#pDeal').val(discount.value);
}

function removeItem(imgCtrl) {
    var imgId = imgCtrl.id;
    $.messager.confirm('删除确认', '确认要删除该文件吗?',
        function (r) {
            if (r) {
                ApiCaller.Delete({
                    url: '/attachment/' + imgId,
                    successFunc: function (result) {
                        $('#li_' + imgId).remove();
                    }
                });
            }
        }
    )
}

function InitProductImages() {
    if (pictureLoaded) return;
    ApiCaller.Get({
        url: '/attachment?busType=2&busId=' + detailForm.getCurrentKey(),
        successFunc: function (result) {
            pictureLoaded = true;
            result.rows.forEach(dataItem => {
                appendImage(dataItem.id, dataItem.url);
            })
        }
    });
}

function switchStock(value) {
    if (value == 1)
        $('.limit').fadeIn();
    else
        $('.limit').fadeOut();
}