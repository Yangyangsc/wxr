var listForm;
///初始化列表控件
function InitSliderGrid() {
    listForm = new listForm('dg', {
        iconCls: 'icon-edit',
        url: '/getuser',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_1',
        rownumbers: true, //行号 
        showFooter: true,
        searchOption: {
            searchButton: '#btnSearch',
            resetButton: '#btnReset'
        },
        createOption: {
            button: '#btnNewSlider',
            url: '/portal/slider_yhq_detail.html',
            title: '优惠券',
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
            url: '/portal/slider_yhq_detail.html',
            icon: 'icon-role',
            title: '优惠券',
            width: 800,
            height: 570
        },
        columns: [
            [
                // {field: 'ck', checkbox: true },
                {
                    field: "mobile",
                    title: "手机号码",
                    width: 200
                },
                {
                    field: 'name',
                    title: '会员名称',
                    width: 280
                },
                {
                    field: 'yhq',
                    title: '优惠券',
                    width: 180,
                    halign: 'center',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value) {
                            return $.formatMoney(value)
                        } else {
                            return "￥0"
                        }
                    }
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