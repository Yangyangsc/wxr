var kollist;
///初始化列表控件
function InitKolGrid() {
    kollist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/kol',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
        searchButton: '#btnSearch', resetButton: '#btnReset'},
        createOption: {button: '#btnNewKol', url:'/brh/koldetail.html', icon: 'icon-user', title: '智库信息', width: 780, height: 550},
        deleteOption: { button: '#btnDeleteKol', url:'/kol/' },
        editOption: { url:  '/brh/koldetail.html',icon: 'icon-user', title: '智库信息', width: 780, height: 550 },
        columns: [[
            { field: 'ck', checkbox: true},
            {
                 field: 'image', title: '',align:'center', halign:'center',width: 60, formatter: function (value, row, index) {
                     var header;
                     console.log(urlConfig.base.imageBase)
                     if (!$.isNullOrEmpty(value))
                         header= "<img src='" +urlConfig.base.imageBase+value+ "' style='border:1px solid #ccc;border-radius: 50%;width:48px;height:48px;cursor:pointer'>";
                     else
                        header= "<img src='../images/kol/default.png' style='border:1px solid #ccc;border-radius: 50%;width:48px;height:48px;cursor:pointer'/>";
                    return header;
                 }
            },
            { field: 'name', title: '姓名',halign:'center', width: 120, sortable: true},
            { field: 'company', title: '企业头衔',halign:'center', width: 180,
                formatter: function (value, row, index) {
                    return value+'<br/>'+row.title;
                }},
            { field: 'contact', title: '联系方式',halign:'center', width: 100},
            { field: 'status', title: '服务状态',align:'center',halign:'center', width: 90, formatter: function (value, row, index) {
                    if (value==1) return '暂停服务';
                    return '正常';
                } 
            }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    InitKolGrid();
});


function reloadKOL() {
    kollist.reload();
}
////停用或启用账号
function setMemberEnableStatus(disble) {
    var memberKeys = kollist.selectedKeyValue();
    if ($.isNullOrEmpty(memberKeys)) {
        return $.messager.alert('提示', '请选择一个会员操作.', '');
    }
    var message = '确认要' + (disble==1? '停用':'启用') + '选中的会员吗?'
    dataForm.doAction({
        method:'put',
        confirm: true,
        confirmMessage: message,
        url: '/member/'+memberKeys+'/disable', data: { disable:disble}, successFunc: function (result) {
            reloadMember();
        }
    });
}

