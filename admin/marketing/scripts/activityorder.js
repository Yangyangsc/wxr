var orderlist, activityList;
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
            { field: 'orderdate',title: '购票日期11111111111111111',halign:'center', width: 125,align:'center',sortable: true},
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
            // { field: 'company',title: '工作单位',halign:'center', width: 160},
            // { field: 'position',title: '职位',halign:'center', width: 80},
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
            { field: 'total',title: '支付金额',halign:'center',align:'center',sortable: true, width: 100,formatter: function (value, row, index) {
                    return $.formatMoney(value);
                } }
           
        ]]
    });
}


///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
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
            bindTicketType(rowData.id);
            InitOrderGrid(rowData.id);
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
    }})
}



