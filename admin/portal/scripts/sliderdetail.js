var listImages;
var detailForm;
$(document).ready(function () {
    $('#tabSlider').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitImageGrid(); break;
            }
        }
    });
    $("input",$("#keyInput").next("span")).blur(validateKeyExist);
    detailForm = new detailForm('formSlider', {
        initForm:function(){
            $('#tabSlider').tabs('close', 1);
        },
        bindOption: { url: '/slider',successFunc:function(result){
            $("#keyInput").attr("readonly","readonly");
        } },
        saveOption: {
            button: '#lnkSave', url: '/slider',
            beforeFunc: function () {
                if (keyExistFlag) {
                    $.messager.alert('提示', '轮播关键字用于前端调用，不能重复.', 'info');
                    return false;
                }
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callbackFunc('reload');
                    $.redirect('sliderdetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
     detailForm.bindForm();
});
///初始化图片列表
function InitImageGrid() {
    if (listImages) return;
    listImages = new listForm('dgImages', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/slider/' + detailForm.getCurrentKey()+'/images',
        idField: 'image_id',
        doubleClickEdit: true,
        createOption: {button: '#btnAddImage', url:'/portal/sliderimagedetail.html?sliderid='+detailForm.getCurrentKey(),title: '轮播图片', width: 800, height: 640},
        editOption: { url:'/portal/sliderimagedetail.html', title: '轮播图片', width: 800, height: 640 },
        deleteOption: {
            button: '#btnDeleteImage', url: '/sliderimage',
            successFunc: function (result) {
                listImages.removeRow();
            }
        },
        toolbar: '#tools_image',
        pagination: false,
        columns: [[
             { field: 'image_url', title: '图片',halign:'center', width: 165,
                    formatter: function (value, row, index) {
                         var coverContainer='';
                        if (!$.isNullOrEmpty(value))
                            coverContainer= "<img src='" +urlConfig.base.imageBase+value+ "' onclick='formHelper.directViewImage(this,640,320)' style='width:160px;height:80px;cursor:pointer'>";
                        else
                            coverContainer="<img src='../images/slider/default.jpg'   style='width:160px;height:80px;'/>";
                        return coverContainer;
             }},
             { field: 'image_topic', title: '主题',halign:'center', width: 180,
                formatter: function (value, row, index) {
                    return "<a href='#' onclick=\"listImages.editRecord('" + row.image_id + "')\"> <h6>" + value + "</h6></a>"
                           +($.isNullOrEmpty(row.image_subtitle)?"":("<div style='height:35px;font-size:9px;color:#999;text-overflow:ellipsis'>"+row.image_subtitle+"</div>"));
                }
             },
             
             { field: 'image_start', title: '启用时间',align:'center', width: 90 },
             { field: 'image_end', title: '截止时间',align:'center', width: 90 },
             { field: 'image_disabled', title: '启停状态', align:'center',width: 80,
                formatter: function (value, row, index) { 
                    if (value==1) return '<span style="margin-left:5px;" class="ident-tag status-failed">停用</span>';
                }
             }
        ]]
    });
}
////停用或启用账号
function setImageEnableStatus(disble) {
    var itemKeys = listImages.selectedKeyValue();
    if ($.isNullOrEmpty(itemKeys)) {
        return $.messager.alert('提示', '请选择一个图片操作.', '');
    }
    var message = '确认要' + (disble==1? '停用':'启用') + '选中的轮播图吗?';
    $.messager.confirm('提示',message,function(r){
        if (r){
            ApiCaller.Put({
                    url:'sliderimage/'+itemKeys+'/setstatus',
                    data:{disabled:disble},
                    successFunc: function (result) {
                        listImages.reload();
                    }
                });
        }
    });
}
///验证Key的重复性
var keyExistFlag = false;
function validateKeyExist(){
    var keyValue = $('#keyInput').val();
    ApiCaller.Get({
                    url:'slider/checkkey',
                    data:{
                        key:keyValue,
                        id:detailForm.getCurrentKey()
                    },
                    successFunc: function (result) {
                        if (result.successed && !result.existed) {
                            $('#errormessage').html("<img src='../images/ticked.png'/><font color='green'></font>");
                            keyExistFlag = false;
                        }
                        else {
                            $('#errormessage').html("<img src='../images/no.png'/><font color='red'>关键字重复</font>");
                            keyExistFlag = true;
                        }
                    }
                });
}