var activitylist, catalogList;
var tagFlag=["status-unident","status-identing","status-failed"];
///初始化列表控件
function InitactivityGrid() {
    activitylist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/activity',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
            searchButton: '#btnSearch', resetButton: '#btnReset', beforeFunc: function (result) {
                if (catalogList.selectedKeyValue()!=null)  result.catalogid = catalogList.selectedKeyValue();
                return true;
            }},
        createOption: {
            button: '#btnNewActivity', url:'/activity/activitydetail.html', icon: 'icon-activity', title: '活动管理', width: 900, height: 650, beforeFunc: function (option) {
                var keyValue = $.isNullOrEmpty(catalogList.selectedKeyValue()) ? '' : catalogList.selectedKeyValue();
                option.url = option.url + '&catalogid=' + keyValue + '&catalogname=' + escape(catalogList.selectedRow()==null?'':catalogList.selectedRow().name)
                return true;
            }
        },
        deleteOption: { button: '#btnDeleteActivity', url:'/activity/' },
        editOption: { url:  '/activity/activitydetail.html', icon: 'icon-activity', title: '活动管理', width: 900, height: 650 },
        columns: [[
            // { field: 'ck', checkbox: true, width: 40 },
            { field: 'cover', title: '封面',halign:'center', width: 130,
                     formatter: function (value, row, index) {
                         var coverContainer='';
                        if (!$.isNullOrEmpty(value))
                            coverContainer= "<img src='" +urlConfig.base.imageBase+value+ "' onclick='formHelper.directViewImage(this,600,290)' style='width:120px;height:60px;cursor:pointer'>";
                        else
                            coverContainer="<img src='../images/activity/default.jpg'   style='width:120px;height:60px;'/>";
                        // if (row.free==1)  coverContainer="<div class='g-activity activity'>"+coverContainer+"<p class='flag is-offer'><span class='flag-text'>免费</span></p></div>";
                        return coverContainer;

                }         
            },
            {
                field: 'topic', title: '活动主题', width: 250,halign:'center', sortable: true,
                formatter: function (value, row, index) {
                    return "<a href='#' onclick=\"activitylist.editRecord('" + row.id + "')\"> <h6>" + value + "</h6></a>"
                           +($.isNullOrEmpty(row.desc)?"":("<div style='height:35px;font-size:9px;color:#999;text-overflow:ellipsis'>"+row.desc+"</div>"));
                }
            },
             { field: 'ck', title: '活动链接', width: 300 ,halign:'center',formatter: function (value, row, index) {
                    var fullUrl = urlConfig.base.activityRoot+'?activityid='+row.id;
                    return fullUrl+
                        '<br/><a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'$.copytext("'+fullUrl+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">复制</span><span class="l-btn-icon icon-copy">&nbsp;</span></span></a>';
                } },
             { field: 'status', title: '活动状态', width: 90 ,align:'center',halign:'center',
                    formatter: function (value, row, index) {
                         return '<span style="margin-left:5px;" class="ident-tag '+tagFlag[value]+'">'+lmh_const.ACTIVITY_STATUS[value]+'</span>';
                } 
            },
            { field: 'catalogname', title: '活动类型',align:'center',halign:'center', width: 90 },
            { field: 'city', title: '举办城市',halign:'center',align:'center', width:80, sortable: true },
            { field: 'start', title: '活动时间', halign:'center',align:'center', width: 130 ,
                formatter: function (value, row, index) {
                    return value + '<br/>至<br/> '+row.end;
                }
            },
            { field: 'ticketend', title: '售票截止', halign:'center',align:'center', width: 120 }
           
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    var randomkey = Math.random();
    catalogList = new listForm('dgCatalog', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/activitycatalog',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_2',
        pagination: false,
        onLoadSuccess:function(data){
             $('#dgCatalog').datagrid('insertRow',{
                        index: 0,	// 索引从0开始
                        row: {id:'',name: '全部'}
                    });

        },
        createOption: {
            button: '#btnNewCatalog', url: '/activity/catalogmanager.html', icon: 'icon-list', title: '活动类型', width: 500, height: 350, closeFunc: function (result) {
                if (result) {
                    catalogList.appendRow({ id: result.data.catalog_id,name: result.data.catalog_name });
                    catalogList.select(catalogList.getRows().length - 1);
                }
            }
        },
        deleteOption: { button: '#btnDeleteCatalog', url:'/activitycatalog', successFunc: function (result) { catalogList.removeRow(); catalogList.selectFirstRow(); } },
        editOption: {
            button: '#btnEditCatalog',
            url: '/activity/catalogmanager.html', icon: 'icon-list', title: '活动类型', width: 500, height: 350, closeFunc: function (result) {
                if (result!=null)   catalogList.updateRow({ id: result.id, name: result.data.catalog_name });
            }
        },
        onSelect: function (rowIndex, rowData) {
            activitylist.loadData({ catalogid: rowData.id });
        },
        columns: [[
            { field: 'name', title: '活动类型', width: 190}
        ]]
    });
    InitactivityGrid();
    
});
function TestButtons(){
    ApiCaller.Get({url:'/activity/'+activitylist.selectedKeyValue()+'/checkinbuttons',successFunc:function(result){
        alert(JSON.stringify(result));
    }});
}
////发布活动
function publishActivity() {
    var actid = activitylist.selectedKeyValue();
    if ($.isNullOrEmpty(actid)) {
        return $.messager.alert('提示', '请选择一个活动记录.', '');
    }
    var message = '确认要将选中的活动记录设置为发布吗?'
    dataForm.doAction({
        method:'put',
        confirm: true,
        confirmMessage: message,
        url: '/activity/'+actid+'/publish', successFunc: function (result) {
            reloadactivity();
        }
    });
}

function reloadactivity() {
    activitylist.reload();
}



