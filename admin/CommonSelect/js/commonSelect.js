document.onkeypress = function () {
        if (event.keyCode == 27) dialogHelper.closeModal();
}
var listForm;
var singleSelect = true;
var dataType = '';
var clientFilter = ''
var searchBox = false;
var displayColumns = null;
var setting;
///获取页面的设置
function getSetting(){
    dataType = $.getUrlParam("dataType"); 
   if ($.isNullOrEmpty(dataType)) return false;
    setting = searchControl[dataType];
    if (setting==null || setting == undefined) return false;
    displayColumns = setting.columns;
    if (typeof(displayColumns)!="Array" && displayColumns.length<=0 ) return false;

   var selectOption = $.getUrlParam("multiSelect");
   if (!$.isNullOrEmpty(selectOption))
       if (selectOption.toLowerCase()=="true")  singleSelect = false;
   clientFilter = $.getUrlParam("clientFilter");
    if (!$.isNullOrEmpty(clientFilter)) 
        clientFilter='?clientFilter='+clientFilter;
    else
        clientFilter='';
   return true;
};

function doSearch() {
   // var json =<%=GetSearchValue()??"null"%>;
    $('#dg').datagrid('load',json);
};
// function getDataUrl() {
//     var searchParam = window.location.search;
//     if (searchParam.length > 0) {
//         searchParam = searchParam.substr(1);
//     }
//     return searchParam;
// }
function InitDataGrid(hasSearch) {
    var searchOption=null;
    if (hasSearch){
        searchOption = {searchButton: '#btnSearch', resetButton: '#btnReset'}
    }
    var searchParam = window.location.search;
    if (searchParam.length>0)
    {
        if (clientFilter!='') 
            clientFilter=clientFilter+'&'+searchParam.substr(1);
        else
            clientFilter = searchParam;
    }
    listForm = new listForm('dg',{
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/common/' + dataType+clientFilter,
        loadMsg: '数据加载中...',
        idField: 'id',
        singleSelect: singleSelect,
        onDblClickRow: function (rowIndex, rowData) {
            if (singleSelect) {
                dialogHelper.closeModal(rowData);
            }
        },
        searchOption: searchOption,
        toolbar: '#tools_1',
        rownumbers: true,//行号 
        columns: displayColumns
    });
}
///创建搜索控件
function initSearchBox()
{
    var searchHtml = setting.control;
    if (!$.isNullOrEmpty(searchHtml)) {
        $('#searchContent').html(searchHtml); 
        $('#searchSubmit').show();
        return true;
    }
    return false;
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    if (getSetting())
    {
        searchBox = initSearchBox();
        InitDataGrid(searchBox);
    }
     $.parser.parse();
});

function ConfirmSelected() {
    if (singleSelect) {
        if (listForm.selectedRow())
            dialogHelper.closeModal(listForm.selectedRow());
        else
            $.messager.alert("提示", "请选择一行数据!", "info");
    }
    else {
        var listData = listForm.getSelections();
        if (listData != null && listData.length > 0)
            dialogHelper.closeModal(listData);
        else
            $.messager.alert("提示", "请至少选择一行数据!", "info");
    }
}
