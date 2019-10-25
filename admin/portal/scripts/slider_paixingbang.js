var listForm;
///初始化列表控件
function InitSliderGrid() {
    listForm = new listForm('dg', {
        iconCls: 'icon-edit',
        url: '/socre',
        idField: 'id',
        doubleClickEdit: false,
        toolbar: '#tools_1',
        // rownumbers: true,//行号 
        showFooter: true,
        searchOption: { searchButton: '#btnSearch', resetButton: '#btnReset' },
        createOption: { button: '#btnAdd', url: '/portal/slider_paixing_add.html', title: '排行添加', width: 800, height: 570, callbackFunc: { reload: function () { listForm.reload(); } } },
        deleteOption: { button: '#btnDeleteSlider', url: '/roles/' },
        editOption: { url: '/portal/slider_paixing_detail.html', icon: 'icon-role', title: '排行详情', width: 800, height: 570 },
        columns: [[
            // {field: 'ck', checkbox: true },
            { field: "id", title: "ID", width: 120, align: 'center' },
            { field: "name", title: "用户名称", width: 150, sortable: true },
            { field: "createTime", title: "开始时间", width: 150 },
            { field: "endTime", title: "结束时间", width: 150 },
            { field: "usedtime", title: "答题时间", width: 150 ,align:"center",sortable: true},
            { field: 'hard', title: '总难度', width: 120, align: 'center',sortable: true },
            { field: 'rightlist', title: '正确回答', width: 250, halign: 'center', align: 'center' },
            { field: 'wronglist', title: '错误回答', width: 250, halign: 'center', align: 'center' },
            { field: 'score', title: '得分', width: 180, halign: 'center', align: 'center', sortable: true },
        ]]
    });
}



///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    ///初始化表格
    InitSliderGrid();
});



