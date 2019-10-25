var detailForm, imgCover,imgShare;
var lstFiles,uploadFiles;
$(document).ready(function () {
    $('#tabArticle').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 2: InitArticleFiles(); break;
            }
        }
    });
    $('#selType').combobox({onChange: switchBox});
    $('#selOriginal').combobox({onChange: switchCreator});
    
     var ue = UE.getEditor('editor',{
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        enableAutoSave: false,
        elementPathEnabled: false,
        wordCount: false
    });
    formHelper.initializePopup();
    imgCover= new uploader('imgCover',{fileKey:'articlecover',refControl:{contentControl:'articleCover',imageControl:'imgCover'}});
    imgShare= new uploader('imgShare',{fileKey:'articlecover',refControl:{contentControl:'articleShare',imageControl:'imgShare'}});

    detailForm = new detailForm('formArticle', {
        initForm:function(){
            $('#catelogname').textbox('setValue',$.getUrlParam('catelogname')); 
            $('#catelogname').textbox('validate');
            $('#catelogid').val($.getUrlParam('catelogid'));
             switchCreator(0);
                switchBox(0);
            $('#tabArticle').tabs('close',2);
        },
        bindOption: {
            url: '/article/', successFunc: function (result) {
                uploadFiles= new uploader('lnkUploadFile',{fileKey:'attachment',data:{data_id:detailForm.getCurrentKey(),bus_type:DATA_BUSINESS_TYPE.Article},multiUpload:true,successFunc:fileUploaded});
                setTimeout(function(){ue.setContent(result.richtext);},500);
                switchCreator(result.original);
                switchBox(result.type);
                if (!$.isNullOrEmpty(result.image))
                    $('#imgCover').attr('src', urlConfig.base.imageBase + result.image);
                if (!$.isNullOrEmpty(result.share))
                    $('#imgShare').attr('src', urlConfig.base.imageBase + result.share);
                if(!$.isNullOrEmpty(result.label))
                {
                    $('#labelInput').tagbox('setValues',result.label.split(','));
                }
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/article',
            beforeFunc:function(result){
                ///验证标签的数量不要多于6个
                var tags = $('#labelInput').tagbox('getValues');
                if (tags!=null && tags.length>6) {
                    $.messager.alert('提示','标签数量不要超过6个,太多不便于精准识别','info');
                    return false;
                }
                $('#realLabel').val(tags.join(','));
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadUser');
                    $.redirect('articledetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
})

function fileUploaded(fileOption){
    alert(fileOption.name);
   lstFiles.reload();
}

function switchBox(newValue){
    if (newValue==0)
        $('.outClass').fadeOut();
    else
        $('.outClass').fadeIn();
}
function switchCreator(newValue){
    if (newValue==0)
        $('.refClass').fadeOut();
    else
        $('.refClass').fadeIn();
}

function InitArticleFiles(){
    if(lstFiles) return;
     lstFiles = new listForm('dgFiles', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveFile', url: '/attachment/',successFunc: function () {
                lstFiles.removeRow();
            }
        },
        iconCls: 'icon-edit',
        url: '/attachment',
        idField: 'id',
        toolbar: '#tools_1',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'ext', title: '',align:'center',width: 32, formatter: function (value, row, index) {
                    if ($.isNullOrEmpty(value))
                        return "<img src='../images/fileExt/"+value+".png' style='width:16px' >";
                }
            },
            { field: 'name', title: '文件名', width: 400 , formatter: function (value, row, index) {
                    if ($.isNullOrEmpty(value))
                        return "<a href='"+urlConfig.base.imageBase+row.url+"'>"+value+"</a>";
                }
            }
        ]]
    });
}