var listForm;
///初始化列表控件
function InitSliderGrid() {
    listForm = new listForm('dg', {
        iconCls: 'icon-edit',
        url: '/slider',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_1',
        rownumbers: true, //行号 
        searchOption: {
            searchButton: '#btnSearch',
            resetButton: '#btnReset'
        },
        createOption: {
            button: '#btnNewSlider',
            url: '/portal/sliderdetail.html',
            title: '轮播设置',
            width: 800,
            height: 570,
            callbackFunc: {
                reload: function () {
                    listForm.reload();
                }
            }
        },
        deleteOption: {
            button: '#btnDeleteSlider',
            url: '/roles/'
        },
        editOption: {
            url: '/Portal/sliderdetail.html',
            icon: 'icon-role',
            title: '轮播设置',
            width: 800,
            height: 570
        },
        columns: [
            [{
                    field: 'ck',
                    checkbox: true
                },
                {
                    field: 'name',
                    title: '轮播名称',
                    width: 280
                },
                {
                    field: 'key',
                    title: '关键字',
                    width: 180,
                    halign: 'center',
                    sortable: true
                },
            ]
        ]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    ///初始化表格
    InitSliderGrid();
});