var treeForm;
var singleSelect = true;
var onlyLeafCheck = false;
var dataType = '';
var dataUrl='';
document.onkeypress = function () {
    if (event.keyCode == 27) dialogHelper.closeModal();
}
///获取页面的设置
function getSetting(){
   dataType = $.getUrlParam("dataType"); 
   dataUrl =  $.getUrlParam("dataUrl"); 
   if ($.isNullOrEmpty(dataType) && $.isNullOrEmpty(dataUrl)) return false;
   if ($.isNullOrEmpty(dataUrl)){
       dataUrl = '/common/hierarchy/' + dataType;
   }
   ///是否允许多选
   var selectOption = $.getUrlParam("multiSelect");
   if (!$.isNullOrEmpty(selectOption) && selectOption.toLowerCase()=="true") singleSelect = false;
   ///是否允许多选
   var onlyLeaf = $.getUrlParam("onlyleaf");
   if (!$.isNullOrEmpty(onlyLeaf) && onlyLeaf.toLowerCase()=="true")  onlyLeafCheck = true;
   ///过滤条件
   clientFilter = $.getUrlParam("clientFilter");
    if (!$.isNullOrEmpty(clientFilter)) 
        clientFilter='?clientFilter='+clientFilter;
    else
        clientFilter='';
   return true;
};

function InitFolderTree() {
    treeForm = new treeForm('ulDirTree',{
        url: dataUrl,//'/common/hierarchy/' + dataType,
        checkbox:!singleSelect,
        onlyLeafCheck:onlyLeafCheck,
        cascadeCheck: false,
        onCollapse:
            function (node) {
                $('#ulDirTree').tree('update', {
                    target: node.target,
                    iconCls: 'icon-folderClose'
                })
            },
        onExpand: function (node) {
            $('#ulDirTree').tree('update', {
                target: node.target,
                iconCls: 'icon-folder'
            });
        },
        onLoadSuccess: function (node, data) {
            $('#ulDirTree').tree('collapseAll');
            var rootItems = $('#ulDirTree').tree('getRoots');
            for (var rootIndex = 0; rootIndex < rootItems.length; rootIndex++) {
                $('#ulDirTree').tree('expand', rootItems[rootIndex].target);
            }
        }
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    // $("#tools_1").smartFloat({
    //     topox: 0,
    //     shadowcss: "one"
    // });
    if (getSetting())  InitFolderTree();
    
});

function ConfirmSelected() {
    var itemData;
    if (singleSelect){
         itemData = $('#ulDirTree').tree('getSelected');
         if (itemData && $.isNullOrEmpty(itemData.id)) itemData=null;
    }
    else{
        itemData = $('#ulDirTree').tree('getChecked');
        if (itemData && itemData.length>0 && $.isNullOrEmpty(itemData[0].id)) itemData = null;
    }
    if (itemData) {
        var retData = packageReturnData(itemData);
        dialogHelper.closeModal(retData);
    }
    else
        $.messager.alert("提示", "请选择数据!", "info");
}

function packageReturnData(treeNode) {
    var selectNodes = [];
    if(treeNode instanceof Array) 
        selectNodes=  treeNode;
    else 
        selectNodes.push(treeNode);
    var returnData = [];
    selectNodes.forEach(function(itemData,index){
    var parentText='',parentId='';
    var currentText,currentId;
    if (itemData) {
        currentText = itemData.text;
        currentId = itemData.id;
        parentid = itemData.pid;
        if (itemData.id=='') return;
        // itemData = $('#ulDirTree').tree('getParent', itemData.target);
        // while (itemData.id != '') {
        //     parentText  =   itemData.text +','+parentText;
        //     parentId    =   itemData.id+','+parentId;
        //     itemData    =   $('#ulDirTree').tree('getParent', itemData.target);
        // }
        // if (parentText.length>0) 
        // {
        //     parentText = parentText.substr(0,parentText.length-1);
        //     parentId = parentId.substr(0,parentId.length-1);
        // }
        returnData.push({
            text:currentText,
            id:currentId,
            pid:parentid
            //parent:{text:parentText.split(','),id:parentId.split(',')}
        });
    }});
    if(singleSelect) return returnData[0];
    return returnData;
}