var listForm;
///初始化列表控件
function InitListGrid() {
    listForm = new listForm('dg',{
        iconCls: 'icon-edit',
        url: '/membertype',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_1',
        createOption: { button: '#btnNewType', url: './crm/membertype.html', icon: 'icon-role', title: '会员类型设置', width: 800, height: 550, callbackFunc: { reload: function () { listForm.reload(); }} },
        deleteOption: { button: '#btnDeleteType', url: '/membertype/' },
        editOption: { url: './crm/membertype.html', icon: 'icon-role', title: '会员类型设置', width: 800, height: 550 },
        columns: [[
            { field: 'ck', checkbox: true },
            {
                 field: 'name', title: '会员类型名称', width: 180,halign: 'center', sortable: true, 
                 formatter: function (value, row, index) {
                     return "<a href='#' onclick=\"listForm.editRecord('" + row.id + "')\">" +value+ "</a>";
                 }
            },
            // {
            //     field: 'level', title: '会员级别',width: 150, align: 'center', sortable: true,
            //      formatter: function (value, row, index) {
            //         return $.getMemberNameByValue(value);
            //     }
            // },
            {
                field: 'price', title: '费用（年)',width: 150, align: 'right', sortable: true,
                 formatter: function (value, row, index) {
                    return $.formatMoney(value);
                }
            },
            { field: 'tg', title: '入会链接', width: 300 ,halign:'center',formatter: function (value, row, index) {
                    var fullUrl = urlConfig.base.joinUsRoot+'?memberid='+row.id;
                    return fullUrl+
                        '<br/><a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'$.copytext("'+fullUrl+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">复制</span><span class="l-btn-icon icon-copy">&nbsp;</span></span></a>';
            } }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    ///初始化表格
    InitListGrid();
});



