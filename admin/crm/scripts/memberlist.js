var memberlist, grouplist,typelist;
///初始化列表控件
function InitMemberGrid() {
    memberlist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/member',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
            searchButton: '#btnSearch', resetButton: '#btnReset', beforeFunc: function (result) {
                // var members = $('#selMemberType').combobox('getValues').join(',');
                // if ($.startWith(members,',')) members = members.substring(1);
                // if ($.endsWith(members,',')) members=members.substring(0,members.length-1);
                // result.memberid = members;
                //if(grouplist.selectedKeyValue()!=null) result.group_id = grouplist.selectedKeyValue();
                return true;
            }},
        // createOption: {button: '#btnNewUser', url:'/member/memberdetail.html', icon: 'icon-user', title: '会员信息', width: 820, height: 550},
        // deleteOption: { button: '#btnDeleteUser', url:'/member' },
        excelOption:{button:'#btnExport',excelkey:'memberinfo',fileName:'memberlist.xlsx'},
        editOption: { url:  '/crm/memberdetail.html',icon: 'icon-user', title: '会员管理', width: 880, height: 650 },
        columns: [[
            { field: 'ck', checkbox: true},
            {
                 field: 'image', title: '会员头像',align:'center', halign:'center',width: 60, formatter: function (value, row, index) {
                     var header;
                     if (!$.isNullOrEmpty(value))
                         header= "<img src='" +urlConfig.base.imageBase+value+ "' style='border:1px solid #ccc;border-radius: 50%;width:32px;height:32px;cursor:pointer'>";
                     else
                        header= "<img src='../images/member/default.png' style='border:1px solid #ccc;border-radius: 50%;width:32px;height:32px'/>";
                    return '<div class="corner_prompt">'+header+'<span class="'+(row.sex==0?'female':'male')+'"></span></div>';
                 }
            },
            {
                field: 'name', title: '昵称',halign:'center', width: 90, sortable: true,
                formatter: function (value, row, index) {
                    return "<a href='#' onclick=\"memberlist.editRecord('" + row.id + "')\">" + value + "</a>";
                }
            },
            { field: 'real_name', title: '真实姓名',halign:'center', width: 70, sortable: true},
            { field: 'mobile', title: '手机号码',halign:'center', width: 110},
            { field: 'membernames', title: '会员',halign:'center', width: 150},
            
            // { field: 'platform', title: '绑定方式',halign:'center', width: 80, formatter: function (value, row, index) {
            //         var platform='';
            //         if (value.indexOf('0')>=0) platform+= '<img src="../images/wechat.png" width="20px"/>';
            //         if (value.indexOf('1')>=0) platform+= '<img src="../images/qq.png" width="20px"/>';
            //         if (value.indexOf('2')>=0) platform+= '<img src="../images/alipay.png" width="20px"/>';
            //         return platform;
            // } },
            { field: 'groups', title: '所属群',halign:'center', width: 150},
            { field: 'city', title: '所在城市',align:'center', width: 100,sortable: true},
            { field: 'corp', title: '工作单位',halign:'center', width: 230, sortable: true},
            { field: 'department', title: '部门/职位',halign:'center', width: 230, sortable: true, formatter: function (value, row, index) {
                    var retValue='';
                    if (!$.isNullOrEmpty(value)) retValue = value;
                    return retValue + ($.isNullOrEmpty(row.position)?'':('/'+row.position));
                } 
            }
        ]]
    });
}
function initMemberTypeGrid(){
    typelist = new listForm('dgMemberType', {
        //title: '应用系统列表',
        url: '/membertype',
        idField: 'id',
        toolbar: '#tools_2',
        pagination: false,
        showHeader:false,
        onLoadSuccess:function(data){
             $('#dgMemberType').datagrid('insertRow',{
                        index: 0,	// 索引从0开始
                        row: {id:'',name: '全部'}
                    });
        },
        onSelect: function (rowIndex, rowData) {
            memberlist.loadData({ memberid: rowData.id });
        },
        columns: [[
            { 
                field: 'name', title: '名称', width: 180,
                formatter: function (value, row, index) {
                    if(!$.isNullOrEmpty(row.id))   return value+'&nbsp;&nbsp;<i class="badge color-important">&nbsp;'+row.count+'&nbsp;</i>';
                    return value;
                    
                } 
             }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    initMemberTypeGrid();
    //$.bindMemberType2Combox({combobox:'selMemberType',firstItem:{id:'',text:'-请选择-'}});
    grouplist = new listForm('dgGroup', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/socialgroup',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_2',
        pagination: false,
        showHeader:false,
        createOption: {
            button: '#btnNewGroup', url: '/crm/groupdetail.html', icon: 'icon-list', title: '群组管理', width: 750, height: 500, closeFunc: function (result) {
                if (result) {
                    grouplist.appendRow({ id: result.data.group_id,name:result.data.group_name, wechat: result.data.group_is_wp,total:0 });
                    grouplist.select(grouplist.getRows().length - 1);
                }
            }
        },
        deleteOption: { button: '#btnDeleteGroup', url:'/socialgroup', successFunc: function (result) { grouplist.removeRow(); grouplist.selectFirstRow(); } },
        editOption: {
            button: '#btnEditGroup',
            url: '/crm/groupdetail.html', icon: 'icon-list', title: '群组管理', width: 750, height: 500, closeFunc: function (result) {
                if (result) grouplist.updateRow({ id: result.id,name: result.name , wechat: result.wechat });
            }
        },
        onLoadSuccess:function(data){
             $('#dgGroup').datagrid('insertRow',{
                        index: 0,	// 索引从0开始
                        row: {id:'',name: '全部'}
                    });

        },
        onSelect: function (rowIndex, rowData) {
            memberlist.loadData({ group_id: rowData.id });
        },
        columns: [[
            { 
                field: 'name', title: '名称', width: 180,
                formatter: function (value, row, index) {
                    if(!$.isNullOrEmpty(row.id))   return value+'&nbsp;&nbsp;<i class="badge color-important">&nbsp;'+row.total+'&nbsp;</i>';
                    return value;
                    
                } 
             }
        ]]
    });
    InitMemberGrid();
});


function reloadMember() {
    memberlist.reload();
}



////停用或启用账号
function setMemberEnableStatus(disble) {
    var memberKeys = memberlist.selectedKeyValue();
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

