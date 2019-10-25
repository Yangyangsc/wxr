var listForm;
///初始化列表控件
function InitRoleGrid() {
    listForm = new listForm('dg',{
        iconCls: 'icon-edit',
        url: '/roles',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_1',
        searchOption: { searchButton: '#btnSearch', resetButton: '#btnReset' },
        createOption: { button: '#btnNewRole', url: '/Admin/RoleDetail.html', icon: 'icon-role', title: '角色信息管理', width: 800, height: 470, callbackFunc: { reload: function () { listForm.reload(); }} },
        deleteOption: { button: '#btnDeleteRole', url: '/roles/' },
        editOption: { url: '/Admin/RoleDetail.html', icon: 'icon-role', title: '角色信息管理', width: 800, height: 470 },
        columns: [[
            { field: 'ck', checkbox: true },
             {
                 field: 'name', title: '角色名称', width: 300, sortable: true, formatter: function (value, row, index) {
                     return "<a href='#' onclick=\"listForm.editRecord('" + row.id + "')\">" +value+ "</a>";
                 }
             },
            {
                field: 'admin', title: '系统管理员',width: 100, align: 'center', sortable: true, formatter: function (value, row, index) {
                    if (value == 1)
                        return '<image src="../images/ticked.png"/>';
                }
            }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    ///初始化表格
    InitRoleGrid();
});



