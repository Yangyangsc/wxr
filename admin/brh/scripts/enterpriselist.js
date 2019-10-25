var enterpriselist, businesslist;
///初始化列表控件
function InitEnterpriseGrid() {
    enterpriselist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/enterprise',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
        searchButton: '#btnSearch', resetButton: '#btnReset'},
        createOption: {button: '#btnNewEnterprise', url:'/brh/enterprisedetail.html', icon: 'icon-user', title: '百人会员信息', width: 820, height: 600},
        deleteOption: { button: '#btnDeleteEnterprise', url:'/enterprise/' },
        excelOption:{button:'#btnExport',excelkey:'memberinfo',fileName:'enterpriselist.xlsx'},
        editOption: { url:  '/brh/enterprisedetail.html',icon: 'icon-user', title: '百人会员信息', width: 820, height: 600 },
        columns: [[
            { field: 'ck', checkbox: true},
            {
                 field: 'image', title: '企业logo',align:'center', halign:'center',width: 60, formatter: function (value, row, index) {
                     var header;
                     if (!$.isNullOrEmpty(value))
                         header= "<img src='" +urlConfig.base.imageBase+value+ "' style='border:1px solid #ccc;width:48px;height:48px;cursor:pointer'>";
                     else
                        header= "<img src='../images/enterprise/default.png' style='border:1px solid #ccc;width:48px;height:48px'/>";
                    return header;
                 }
            },
            {
                field: 'name', title: '企业名称',halign:'center', width: 170, sortable: true,
                formatter: function (value, row, index) {
                    return "<br/><a href='#' onclick=\"enterpriselist.editRecord('" + row.id + "')\"><h6>" + value + "</h6></a>"+
                            ($.isNullOrEmpty(row.ename)?"":("<div style='height:45px;width:240px;font-size:9px;color:#999;text-overflow:ellipsis'>"+row.ename+"</div>"));
                }
            },
            { field: 'business', title: '所属行业',align:'center',halign:'center', width: 80},
            { field: 'account', title: '登录账号',halign:'center', width: 100},
            { field: 'level', title: '会员级别',align:'center',halign:'center', width: 90, sortable: true, formatter: function (value, row, index) {
                    if (value==1) return '企业标准会员';
                    return '理事单位会员';
                } 
            },
            { field: 'startdate', title: '会员期限',halign:'center', width: 100,  formatter: function (value, row, index) {
                    var retValue='';
                    if (row.expired==1) retValue='&nbsp;&nbsp;<div><i class="badge color-important">已过期</i></div>';
                    retValue=retValue+'<div>'+value+'<br/> -- <br/>'+row.enddate+'</div>';
                    return retValue;
                } 
            },
            { field: 'appservice', title: '请求服务',align:'center',halign:'center', width: 90, formatter: function (value, row, index) {
                    if (value>0) return '&nbsp;&nbsp;<i class="badge color-important">&nbsp;'+value+'&nbsp;</i>';
                    return '无';
                } 
            },
            { field: 'contact', title: '企业联系人',halign:'center', width: 140, formatter: function (value, row, index) {
                    return value +'('+row.mobile+')';
                } 
            }
        ]]
    });
}
function initBusinessGrid(){
    typelist = new listForm('dgBusiness', {
        //title: '应用系统列表',
        url: '/dictionary/subitems?name=business',
        idField: 'rec_id',
        pagination: false,
        showHeader:false,
        onLoadSuccess:function(data){
             $('#dgBusiness').datagrid('insertRow',{
                        index: 0,	// 索引从0开始
                        row: {rec_id:'',item_name: '所有行业'}
                    });
        },
        onSelect: function (rowIndex, rowData) {
            enterpriselist.loadData({ business: rowData.rec_id });
        },
        columns: [[
            {field: 'item_name', title: '行业', width: 180}
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    initBusinessGrid();
    InitEnterpriseGrid();
});


function reloadMember() {
    enterpriselist.reload();
}
////停用或启用账号
function setMemberEnableStatus(disble) {
    var memberKeys = enterpriselist.selectedKeyValue();
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

function resetPassword() {
    var itemKeys = enterpriselist.selectedKeyValue();
    if ($.isNullOrEmpty(itemKeys)) {
        return $.messager.alert('提示', '请选择一个用户.', '');
    }
    dataForm.postAction({
        confirm: true,
        confirmMessage: '确认要重置选中会员的密码吗?',
        url: 'enterprise/'+itemKeys+'/resetpassword',successMessage: '密码已成功重置为初始密码【123456】!',
    });
}