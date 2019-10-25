var orderlist,ticketList,channelList, activityList;
var ticketsGroupLoaded=false,channelGroupLoaded=false;
var currentActivityId;
var JsonKey2Chinese={
        company:"公司",
        position:"职位",
        name:"名称",
        mobile:"电话",
        phone:"电话",
        wechat:"微信",
        business:"所在行业",
        city:"所在城市",
        annualsales:"年销售额",
        ipo:"上市计划",
        investment:"投资计划",
        mbusiness:"主营业务",
        companyscale:"企业规模",
        referee:"推荐人"
    };
///获取活动所有的订单清单
function InitOrderGrid(activityId) {
    orderlist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/activity/'+activityId+'/orders',
        method:"get",
        idField: 'id',
        toolbar: '#tools_order',
        rownumbers: true,
        showFooter: true,
        searchOption: {searchButton: '#btnSearch', resetButton: '#btnReset'},
        excelOption:{button:'#btnOrderExcel',excelkey:'activityOrder',fileName:'orderlist.xlsx'},
        columns: [[
            { field: 'orderdate',title: '购票日期',halign:'center', width: 125,align:'center',sortable: true},
            { field: 'name',title: '姓名',halign:'center', width: 150,sortable: true,formatter: function (value, row, index) {
                        if($.isNullOrEmpty(value)) return '';
                        return '<b>'+value+'</b> &nbsp;&nbsp;('+row.mobile+')';
            }},
            { field: 'company',title: '工作单位',halign:'center', width: 150,sortable: true,formatter: function (value, row, index) {
                    if(!$.isNullOrEmpty(value))
                        return row.company+'&nbsp;&nbsp;('+row.position+')';
                   
            }},
			{ field: 'enrolljson',title: '资料信息',halign:'center', width: 190,formatter: function (value, row, index) {
                if(!$.isNullOrEmpty(value)){
                    var data = JSON.parse(value);
                    var retValue = '';
                    Object.keys(data).forEach(function(item,index){
                        retValue = retValue+JsonKey2Chinese[item]+" : "+data[item]+"<br/>";
                    })
                    if (retValue.length>0) return retValue;
                }
            }},
            
            { field: 'channel',title: '引荐渠道',halign:'center', width: 120,sortable: true},
            { field: 'gift',title: '类型', width: 70,halign:'center',align:'center', formatter: function (value, row, index) {
                    if (value==1)return '赠票';
                    if (value==0)return '销售票';
                }
            },
            { field: 'ticket',title: '购买票类',halign:'center',align:'center',sortable: true, width: 70},
            { field: 'count',title: '购买数量',halign:'center',align:'center',sortable: true, width: 70},
            { field: 'price',title: '单价',halign:'center',align:'center', width: 80,formatter: function (value, row, index) {
                   if(!$.isNullOrEmpty(value)) return $.formatMoney(value);
                } },
            { field: 'checkcount',title: '签到数量',halign:'center',align:'center', width: 80,sortable: true},
            // { field: 'cc',title: '订单总额',halign:'center',align:'center',sortable: true, width: 110,formatter: function (value, row, index) {
            //             return $.formatMoney(row.count * row.price);
            // }},
            // { field: 'discount',title: '渠道折扣', width: 90,halign:'center',align:'center', formatter: function (value, row, index) {
            //         if (value>=100)
            //             return '<span style="margin-left:5px;" class="ident-tag status-identing">无折扣</span>';
            //         else
            //             return value + '%'
            //     }
            // },
            {field:"yhq",title:"优惠券",halign:"center",align:"center",sortable:true,width:100,formatter(value,row,index){
                if(value){
                    return $.formatMoney(value)
                }else{
                    return "￥0"
                }
            }},
            { field: 'total',title: '支付金额',halign:'center',align:'center',sortable: true, width: 100,formatter: function (value, row, index) {
                    return $.formatMoney(value);
                } }
           
        ]]
    });
}
///活动根据票务类型汇总
function InitOrderTicketGroup() {
    // if (ticketsGroupLoaded) return;
    // ticketsGroupLoaded=true;
    ticketList = new listForm('dgTicket', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/activity/'+currentActivityId+'/ticketsummary',
        method:"get",
        //idField: 'ticket_id',
        toolbar: '#tools_ticket',
        pagination: false,
        showFooter: true,
        rownumbers: true,
        fitColumns: true,
        excelOption:{button:'#btnOrderTickets',excelkey:'activityTicketSales',fileName:'ticketsummary.xlsx'},
        columns: [[
            { field: 'ticket_title',title: '票务类型',halign:'center', width: 160},
            { field: 'count',title: '总销售数量',halign:'center',align:'center', width: 130},
            { field: 'total',title: '总销售金额',halign:'center',align:'center', width: 80,
                    formatter: function (value, row, index) {
                        return $.formatMoney(value);
                    } 
            },
            { field: 'channelcount',title: '销售数量(合作渠道)',halign:'center',align:'center', width: 130},
            { field: 'channeltotal',title: '销售金额(合作渠道)',halign:'center',align:'center', width: 150,
                    formatter: function (value, row, index) {
                        return $.formatMoney(value);
                    } 
            }
           
        ]]
    });
}
///活动根据合作渠道汇总
function InitChannelsGroup() {
    // if (channelGroupLoaded) return ;
    // channelGroupLoaded = true;
    channelList = new listForm('dgChannel', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/activity/'+currentActivityId+'/channelsummary',
        method:"get",
        toolbar: '#tools_Channel',
        searchOption: {searchButton: '#btnSearchChannel', resetButton: '#btnResetChannel'},
        excelOption:{button:'#btnOrderChannel',excelkey:'activityChannelTotal',fileName:'channelSales.xlsx'},
        columns: [[
            { field: 'name',title: '渠道名称',halign:'center', width: 160},
            { field: 'tickettitle',title: '票务类型',halign:'center', width: 100},
            { field: 'count',title: '销售数量',halign:'center',align:'center', width: 130},
            { field: 'total',title: '销售金额',halign:'center',align:'center', width: 80,sortable: true,
                    formatter: function (value, row, index) {
                        return $.formatMoney(value);
                    } 
            }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    //  $('#tabActivity').tabs({
    //     tabWidth: 130,
    //     tabHeight: 40,
    //     onSelect: function (title, index) {
    //         switch (index) {
    //             case 2: InitOrderTicketGroup(); break;
    //             case 3: InitChannelsGroup(); break;
    //         }
    //     }
    // });
    var randomkey = Math.random();
    activityList = new listForm('dgActivity', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/activity/checkin',
        idField: 'id',
        toolbar: '#tools_2',
        pagination: false,
        onLoadSuccess:function(data){
             if (data.rows.length>0){
                 $('#dgActivity').datagrid('selectRow',0);
             }
        },
        onSelect: function (rowIndex, rowData) {
            $('#btnReset').click();
            $('#btnResetChannel').click();
            currentActivityId = rowData.id;
            $('#activityChart').attr('src','/analysis/activityreport.html?activityid='+rowData.id)
            bindTicketType(rowData.id);
            InitOrderGrid(rowData.id);
            //ticketsGroupLoaded=channelGroupLoaded=false;
            InitOrderTicketGroup(rowData.id);
            InitChannelsGroup(rowData.id);
        },
        columns: [[
            { field: 'topic', title: '活动', width: 190}
        ]]
    });
    
});

function bindTicketType(actid){
     ApiCaller.Get({url:'/activity/'+actid+'/tickets',successFunc:function(result){
        var ticketArray = result.rows;
        ticketArray.splice(0,0,{id:'',title:'-请选择-'})
        formHelper.bindCombo({combobox:'actTicket',data:ticketArray,textField:'title'})
        formHelper.bindCombo({combobox:'actTicket4Channel',data:ticketArray,textField:'title'})
        
        // $("#actTicket").empty();
        //  $("#actTicket").append("<option value=''>全部</option>");
        //        $("#actTicket4Channel").empty();
        //   $("#actTicket4Channel").append("<option value=''>全部</option>");
        // result.rows.forEach(function(value,index){
        //     $("#actTicket").append("<option value='"+value.id+"'>"+value.title+"</option>");
        //     $("#actTicket4Channel").append("<option value='"+value.id+"'>"+value.title+"</option>");
        // });
    }})
}



