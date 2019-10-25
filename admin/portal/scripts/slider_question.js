var listForm;
///初始化列表控件
function InitSliderGrid() {
    listForm = new listForm('dg', {
        iconCls: 'icon-edit',
        url: '/question',
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
            url: '/portal/slider_question_add.html',
            icon: 'icon-role',
            title: '问答添加',
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
            url: '/roles/'
        },
        editOption: {
            url: '/portal/slider_question_detail.html',
            icon: 'icon-role',
            title: '问答管理',
            width: 800,
            height: 570
        },
        columns: [
            [{
                    field: "que",
                    title: "问题",
                    width: 200
                },
                {
                    field: 'ans',
                    title: '正确答案',
                    width: 50,
                    align: 'center'
                },
                {
                    field: 'hard',
                    title: '难度',
                    width: 50,
                    align: 'center',
                    sortable: true
                },
                {
                    field: 'cat_id',
                    title: '问题类型',
                    width: 120,
                    align: 'center',
                    sortable: true,
                    formatter(value, row, index) {
                        if (value == 1) return "运营"
                        if (value == 2) return "文案"
                        if (value == 3) return "热点"
                        if (value == 4) return "技术"
                    }
                },
                {
                    field: "img",
                    title: "图片",
                    width: 140,
                    halign: "center",
                    align: "center",
                    formatter(value, row, index) {
                        if(value){
                            return `<img style="width:80px;height:80px;" src="${urlConfig.base.imageBase}${value}" alt="img">`
                        }else{
                            return "暂无图片"
                        }
                    }
                },
                {
                    field: 'opt1',
                    title: '答案A',
                    width: 200,
                    halign: 'center',
                    align: 'center'
                },
                {
                    field: 'opt2',
                    title: '答案B',
                    width: 200,
                    halign: 'center',
                    align: 'center'
                },
                {
                    field: 'opt3',
                    title: '答案C',
                    width: 200,
                    halign: 'center',
                    align: 'center'
                },
                {
                    field: 'opt4',
                    title: '答案D',
                    width: 200,
                    halign: 'center',
                    align: 'center'
                },
                {
                    field: 'accuracy',
                    title: '正确率',
                    width: 200,
                    halign: 'center',
                    align: 'center'
                },
                {
                    field: 'del',
                    title: '删除',
                    width: 120,
                    halign: 'center',
                    align: 'center',
                    sortable: true,
                    formatter(value, row, index) {
                        if (value == 0) {
                            return "未删除"
                        }
                        if (value == 1) {
                            return "已删除"
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