///初始化列表控件
var treeGrid;
function InitMenu() {
    treeGrid = new treeGrid('dg',{
        url: '/function',
        idField: 'id',
        doubleClickEdit:true,
        treeField: 'text',
        toolbar: '#tools_1',
        createOption: {
            button: '#btnNewMenu', url:'/Admin/MenuDetail.html', icon: 'icon-function', title: '功能管理', width: 800, height: 500, beforeFunc: function (option) {
                option.url = option.url + '&parentUid=' + treeGrid.selectedKeyValue();
                return true;
            },
            callbackFunc: { reload: function () { treeGrid.reload(); } }
        },
        deleteOption: {button: '#btnDeleteMenu', url: '/function'},
        editOption: { button: '#btnEditMenu', url: '/Admin/MenuDetail.html', icon: 'icon-function', title: '功能管理', width: 800, height: 500, callbackFunc: { reload: function () { treeGrid.reload(); } } },

        columns: [[
            { field: 'text', title: '名称', width: 220 },
            {
                field: 'type', title: '类型', width: 90, formatter: function (value, row, index) {
                    return value == 0 ? '<span>本站链接</span>' : (value == 1 ? '<span>外部链接</span>' : '');
                }
            },
            {
                field: 'icon', title: '图标', width: 50, align: 'center', formatter: function (value, row, index) {
                    return $.isNullOrEmpty(value) ? '' : '<img width="16px" src="' +urlConfig.base.imageBase + value + '" />';
                }
            },
            { field: 'url', title: '导航地址', width: 350 },
            {
                field: 'disable', title: '状态', width: 120, align: 'center', formatter: function (value, row, index) {
                    if (value == 1)
                        return '<image src="../images/stop.png" title="停用"/>';
                }
            },
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    InitMenu();
});

////停用或启用功能
function setMenuEnableStatus(disable) {
    var menuItem = treeGrid.selectedKeyValue();
    if ($.isNullOrEmpty(menuItem)) {
        $.messager.alert('提示', '请选择一个菜单项操作.', 'info');
        return;
    }
    dataForm.postAction({
        confirm: true, confirmMessage: '确认要' + (disable == 1 ? '停用' : '启用') + '选中的功能吗?',
         url: '/function/disable/'+menuItem, data: { disable: disable},
        successFunc: function (result) {    treeGrid.reload();   }
    });
}



