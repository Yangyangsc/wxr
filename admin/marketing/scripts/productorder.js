var listForm;
///初始化列表控件
function InitOrderGrid() {
    listForm = new listForm('dg',{
        url: '/productorder',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_Order',
        showFooter:true,
        //  view: detailview,
        // detailFormatter:function(index,row){
        //     return '<div style="padding:2px"><table class="ddv"></table></div>';
        // },
        // onExpandRow: 
        // function(index,row){
        //     var ddv = $(this).datagrid('getRowDetail',index).find('table.ddv');
        //     bindOrderDetail2SubGrid(row.id,ddv,index);
        // },
        searchOption: { searchButton: '#btnSearch', resetButton: '#btnReset' },
        editOption: { url: '/marketing/orderdetail.html',  title: '订单详情', width: 830, height: 650 },
        columns: [[
            {field: 'orderno', title: '订单编号', halign:'center',width: 100, sortable: true,
                    formatter: function (value, row, index) {
                        if ($.isNullOrEmpty(value)) return;
                     return "<a href='#' onclick=\"listForm.editRecord('" + row.id + "')\">" +value+ "</a>";
            }},
            {field: 'orderdate', title: '订单日期', halign:'center',width: 110, sortable: true},
            {
                 field: 'username', title: '用户', halign:'center',width: 170, 
                 formatter: function (value, row, index) {
                     if ($.isNullOrEmpty(value)) return;
                     var retUser;
                     if (!$.isNullOrEmpty(row.image))
                        retUser= "<img src='" +urlConfig.base.imageBase+row.image+ "' style='width:30px;border:1px solid #CCC;border-radius: 50%;vertical-align:middle;'>";
                    else
                        retUser= "<img src='../images/member/default.png' style='border:1px solid #ccc;border-radius: 50%;width:30px;height:30px;vertical-align:middle;'/>";
                      retUser+='<span style="padding-left:5px;">'+value+'('+row.mobile+')</span>';
                      return retUser;
                 }
             },
             {
                 field: 'receive', title: '收件信息', halign:'center',width: 270, 
                 formatter: function (value, row, index) {
                     if ($.isNullOrEmpty(value)) return '--';
                     if (value=="合计") return value;
                     var retinfo = JSON.parse(value);
                     return '<div style="white-space:normal;word-wrap:break-word;line-height:22px">收件人 : '+retinfo.name +
                            '<br>联系电话 : '+retinfo.mobile+')<br>'+
                            '地 址 : '+retinfo.address+'</div>' ;
                 }
             },
             {field: 'total', title: '金额',halign:'center',sortable: true, width: 80, align: 'right',
                formatter: function (value, row, index) {
                     return $.formatMoney(value);
             }},
             {field: 'paydate', title: '支付日期',align:'center', width: 120},
             {field: 'processstatus', title: '处理状态', halign:'center',width: 90,
                  formatter: function (value, row, index) {
                        if (value==0) return '-未处理-'
                        if(value==1){
                            if (row.processresult==1) return '已发货';
                            if (row.processresult==2) return '已退款';
                        }
                 }
             },
             {field: 'processuser', title: '客服人员', halign:'center',
                  formatter: function (value, row, index) {
                        if ($.isNullOrEmpty(value)) return;
                        return value+'('+row.processdate+')'
                 }
             }

        ]]
    });
}
$(document).ready(function () {
    InitOrderGrid();
});

function processOrder(){
    var orderItem = listForm.selectedRow();
    var rowIndex =$('#dg').datagrid('getRowIndex',orderItem);
    if (!orderItem){
        $.messager.alert('提示','请选择订单记录.','info');
        return;
    }
    if (orderItem.processstatus>0){
        $.messager.confirm('询问','该订单已被标记处理,确认需要修改处理结果?',function(r){
            if (r){
                dialogHelper.showModal({ title: '订单处理', 
                url: './marketing/orderprocess.html?orderid='+orderItem.id, width: 600, height: 350,
                closeFunc:function(result){
                    if (result){
                        listForm.reload();
                        // $.extend(orderItem,{processuser:result.user,processstatus:1,processresult:result.result,processdate:$.formatDate(new Date(),"yyyy-MM-dd hh:mm")})
                        // $('#dg').datagrid('updateRow',{index:rowIndex,row:orderItem });
                    }
                } });
            }
        });
    }
    else
        dialogHelper.showModal({ title: '订单处理', 
                url: './marketing/orderprocess.html?orderid='+orderItem.id, width: 600, height: 350,
                closeFunc:function(result){
                    if (result){
                        listForm.reload();
                        // $.extend(orderItem,{processuser:result.user,processstatus:1,processresult:result.result,processdate:$.formatDate(new Date(),"yyyy-MM-dd HH:mm")})
                        // $('#dg').datagrid('updateRow',{index:rowIndex,row:orderItem });
                    }
                } });
    
}

function bindOrderDetail2SubGrid(id,subGrid,index){
    ApiCaller.Get({url:'/productorder/'+id+'/detail',
                   successFunc:function(result){
                    subGrid.datagrid({
                        data:result,
                        fitColumns:true,
                        singleSelect:true,
                        //rownumbers:true,
                        height:'auto',
                        columns:[[
                            {field: 'product_image', title: '图片', align:'center',width: 80, 
                                formatter: function (value, row, index) {
                                    if (!$.isNullOrEmpty(value))
                                            return "<img src='" +urlConfig.base.imageBase+value+ "' style='width:65px;border:1px solid #CCC'>";
                                    return "";
                                }
                            },
                            {field:'product_name',title:'商品名称',halign:'center'},
                            {field:'order_count',title:'数量',width:70,halign:'center',align:'center'},
                            {field:'unit_price',title:'单价',width:100,align:'right',
                                formatter: function (value, row, index) {
                                    return $.formatMoney(value);
                            }},
                            {field:'product_id',title:'小计',width:100,align:'right',
                                formatter: function (value, row, index) {
                                    return $.formatMoney(row.order_count * row.unit_price);
                            }}
                        ]],
                        onResize:function(){
                            $('#dg').datagrid('fixDetailRowHeight',index);
                        },
                        onLoadSuccess:function(){
                            setTimeout(function(){
                                $('#dg').datagrid('fixDetailRowHeight',index);
                            },100);
                        }
                    });
                    $('#dg').datagrid('fixDetailRowHeight',index);
                }
    })
}