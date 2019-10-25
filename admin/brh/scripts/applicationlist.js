var listForm;
///初始化列表控件
function InitListGrid() {
    listForm = new listForm('dg',{
        iconCls: 'icon-edit',
        url: '/enterprise/appservice',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_1',
        //editOption: { url: './crm/membertype.html', icon: 'icon-role', title: '会员类型设置', width: 800, height: 550 },
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'date', title: '申请时间', width: 110,halign: 'center', sortable: true},
            { field: 'name', title: '企业名称', width: 180,halign: 'center', sortable: true},
            { field: 'servicename', title: '申请服务',width: 150, halign: 'center',  sortable: true},
            { field: 'targetname', title: '对象名称',width: 100,halign: 'center' },
            { field: 'status', title: '处理状态',width: 80, align: 'center', sortable: true,
                 formatter: function (value, row, index) {
                     return ['未处理','已完成','预约失败'][value];  
                }
            }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    ///初始化表格
    InitListGrid();
});

function process(){
    var appItem = listForm.selectedRow();
    var rowIndex =$('#dg').datagrid('getRowIndex',appItem);
    if (!appItem){
        $.messager.alert('提示','请选择预约记录.','info');
        return;
    }
    if (appItem.status>0){
        $.messager.confirm('询问','该预约已被标记处理,确认需要修改处理结果?',function(r){
            if (r) doProcess(appItem.id);
        });
    }
    else
        doProcess(appItem.id);
    
}
///处理预约单
function doProcess(id){
    dialogHelper.showModal({title: '预约处理', 
                            url: './brh/dateprocess.html?appid='+id, width: 600, height: 350,
                            closeFunc:function(result){
                                if (result){
                                    listForm.reload();
                                }
                            }});
}
