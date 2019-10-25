///初始化列表控件
var treeGrid;
function InitCategory() {
    treeGrid = new treeGrid('dg',{
        url: 'MaterialCategory.aspx?action=GetMaterialCategoryHierarchical',
        idField: 'id',
        doubleClickEdit:true,
        treeField: 'text',
        toolbar: '#tools_1',
        createOption: {
            button: '#btnNewMenu', url: rootVirtual + '/Admin/MaterialCategoryDetail.aspx', icon: 'icon-function', title: '食材分类管理', width: 700, height: 550, beforeFunc: function (option) {
                option.url = option.url + '&parentUid=' + treeGrid.selectedKeyValue();
                return true;
            },
            callbackFunc: { reload: function () { treeGrid.reload(); } }
        },
        deleteOption: {button: '#btnDeleteMenu', url: rootVirtual + '/Admin/MaterialCategoryDetail.aspx'},
        editOption: { button: '#btnEditMenu', url: rootVirtual + '/Admin/MaterialCategoryDetail.aspx', icon: 'icon-function', title: '食材分类管理', width: 700, height: 550, callbackFunc: { reload: function () { treeGrid.reload(); } } },

        columns: [[
             { field: 'text', title: '类型名称', width: 220 },
            {
                field: 'iconCls', title: '图标', width: 50, align: 'center', formatter: function (value, row, index) {
                    return $.isNullOrEmpty(value) ? '' : '<img src="' + rootVirtual + value + '" />';
                }
            },
            {
                field: 'navigator', title: 'Apps 导航', width: 120, align: 'center', formatter: function (value, row, index) {
                    if (value)
                        return '<image src="../images/ticked.png" title="导航"/>';
                }
            },
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    InitCategory();
});

function exportJson() {
    dataForm.doAction({
        method: 'post', url: 'MaterialCategory.aspx', action: 'ExportCategoryJson', value:null,prompt:false,
        successFunc: function (result) { $.messager.alert('成功','食材类型数据生成完毕!','info'); }
    });
}
////停用或启用功能
function setCategoryNavigate(enable) {
    var menuItem = treeGrid.selectedKeyValue();
    if ($.isNullOrEmpty(menuItem)) {
        $.messager.alert('提示', '请选择一个食材类型操作.', 'info');
        return;
    }
    dataForm.doAction({
        confirm: true, confirmMessage: '确认要设置该食材类型为' + (enable == 0 ? '取消导航吗?' : '启用导航吗?'),
        method: 'post', url: 'MaterialCategory.aspx', action: 'SetMaterialNavigate', value: { action: enable, key: menuItem },
        successFunc: function (result) {    treeGrid.reload();   }
    });
}



