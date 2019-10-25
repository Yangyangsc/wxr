var listForm;
///初始化列表控件
function InitSliderGrid() {
    listForm = new listForm('dg', {
        iconCls: 'icon-edit',
        url: '/game_rules',
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
            button: '#btnAdd',
            url: '/portal/slider_rule_add.html',
            icon: 'icon-role',
            title: '游戏规则添加',
            width: 800,
            height: 550,
            callbackFunc: {
                reload: function () {
                    listForm.reload();
                }
            }
        },
        deleteOption: {
            button: '#btnDeleteSlider',
            url: '/game_rule/'
        },
        editOption: {
            url: '/portal/slider_rule_detail.html',
            icon: 'icon-role',
            title: '游戏规则管理',
            width: 800,
            height: 570
        },
        columns: [
            [{
                    field: "id",
                    title: "ID"
                },
                {
                    field: "activity_id",
                    title: "活动ID",
                    width: 120,
                    halign: "center",
                    align: "center",
                },
                {
                    field: "activity_topic",
                    title: "活动名称"
                },
                {
                    field: "rule",
                    title: "游戏规则详情",
                },
                {
                    field: "used",
                    title: "规则是否使用中",
                    halign: "center",
                    align: "center",
                    formatter(value, row, index) {
                        if (value == 0) {
                            return "未使用"
                        } else if (value == 1) {
                            return "使用中"
                        }
                    }
                }
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