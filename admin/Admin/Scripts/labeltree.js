var itemlist, catalogList;
function InitCatalog() {
    catalogList = new listForm('dgLabel', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/label/catalog',
        idField: 'id',
        doubleClickEdit: true,
        rownumbers: true,
        toolbar: '#tools_2',
        pagination: false,
        createOption: {
            button: '#btnNewLabel', url: '/Admin/label.html', title: '标签管理', width: 500, height: 300, 
            closeFunc: function (result) {
                if (result) {
                    catalogList.reload();
                }
            }
        },
        deleteOption: { button: '#btnDeleteLabel', url:'/label', successFunc: function (result) { catalogList.removeRow(); catalogList.selectFirstRow(); } },
        editOption: {
            button: '#btnEditLabel',
            url: '/Admin/label.html',  title: '标签管理', width: 500, height: 300, closeFunc: function (result) {
                catalogList.updateRow({name: result.data.label_name });
            }
        },
        onSelect: function (rowIndex, rowData) {
            itemlist.loadData({ pid: rowData.id });
        },
        columns: [[
            { field: 'name', title: '标签分类', width: 150, sortable: true }
        ]]
    });
}
///初始化列表控件
function InitItemGrid() {
    itemlist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        doubleClickEdit:true,
        url: '/label',
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: { searchButton: '#btnSearch', resetButton: '#btnReset', beforeFunc: function (result) { result.LabelUid = catalogList.selectedKeyValue(); } },
        createOption: {
            button: '#btnNewItem', url: '/Admin/label.html',  title: '标签项', width: 500, height: 300,
            beforeFunc: function (option) {
                var parentValue = catalogList.selectedKeyValue();
                if ($.isNullOrEmpty(parentValue)) {
                    $.messager.alert('提示', '请首先选择标签类型!', 'info');
                    return false;
                }
                option.url = option.url + '&pid=' + parentValue;
                return true;
            },
            closeFunc: function (result) {
                if (result)
                    itemlist.reload();
                    //itemlist.appendRow({parentname:catalogList.selectedRow('name'), id: result.data.label_id,count:0, name: result.data.label_name });
            }
        },
        deleteOption: { button: '#btnDeleteItem', url:  '/label' },
        editOption: {
            url: '/Admin/label.html',  title: '标签项', width: 500, height: 300, closeFunc: function (result) {
                if (result)
                    itemlist.updateRow({parentname:catalogList.selectedRow('name'),  name: result.data.label_name });
            }},
        columns: [[
            { field: 'parentname', title: '标签分类', width: 200, sortable: true },
            {
                field: 'name', title: '标签名称', width: 200, formatter: function (value, row, index) {
                    return "<a href='#' onclick=\"itemlist.editRecord('" + row.id + "')\">" + value + "</a>";
            }
            },
            { field: 'count', title: '打标次数', width: 120, sortable: true }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    InitCatalog()
    InitItemGrid();
});
function reloadItems() {
    itemlist.reload();
}


