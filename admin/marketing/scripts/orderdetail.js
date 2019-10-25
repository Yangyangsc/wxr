var detailForm;
var uploadPictures,imgProduct,imgProduct1,imgProduct2;
$(document).ready(function () {
    detailForm = new detailForm('formOrder', {
        bindOption: { url: '/productorder',successFunc(result){
            if (!$.isNullOrEmpty(result.receive)) {
                var retinfo = JSON.parse(result.receive);
                $('#receive').html('<p>收件人 ： '+retinfo.name +'</p>'+
                                   '<p>联系电话:'+retinfo.mobile+'</p>'+
                                    '<p>地 址  ： '+retinfo.address+'</p>');
            }
            showProcessResult(result.processstatus,result.processresult,result.processopinion,result.processuser,result.processdate);
            $('#total').val($.formatMoney(result.total));
            InitOrderItems(result.id);
        }},
    });
    detailForm.bindForm();
    
});

function showProcessResult(status,result,opinion,user,date){
    var processButton = '<a href="#" onclick="processOrder()" class="easyui-linkbutton button-default l-btn l-btn-small" style="float: right;padding-top: 3px" group="" id=""><span class="l-btn-left"><span class="l-btn-text">'+(status==0?'处理订单':'更改处理结果')+'</span></span></a>';
    if (status==0)
        $('#process').html('订单等待处理'+processButton);
    else
    {
        var processResult = ["","已发货","已退款"];
        $('#process').html(processButton+"处理结果:"+processResult[result]+"<br>"+
                            "意见备注:"+opinion+"<br>"+
                            "处理客服:"+user+"&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"+
                            "处理日期:"+date);
    }
}
function processOrder(){
     dialogHelper.showModal({ title: '订单处理', 
                url: './marketing/orderprocess.html?orderid='+detailForm.getCurrentKey(), width: 600, height: 350,
                closeFunc:function(result){
                    if (result){
                        showProcessResult(1,result.result,result.opinion,result.user,$.formatDate(new Date(),"yyyy-MM-dd hh:mm"));
                    }
                } });
}
function InitOrderItems(id) {
    listForm = new listForm('dgOrder',{
        iconCls: 'icon-edit',
        url: '/productorder/'+id +'/detail',
        idField: 'item_id',
        title:'订单明细',
        pagination:false,
        columns:[[
            {field: 'product_image', title: '图片', align:'center',width: 80, 
                formatter: function (value, row, index) {
                    if (!$.isNullOrEmpty(value))
                            return "<img src='" +urlConfig.base.imageBase+value+ "' style='width:65px;border:1px solid #CCC'>";
                    return "";
                }
            },
            {field:'product_name',title:'商品名称',width: 220, halign:'center',
                formatter: function (value, row, index) {
                    return '<div style="white-space:normal;height:60px;word-break:break-all;">'+value+'</div>';
                }},
            {field:'order_count',title:'数量',width:70,halign:'center',align:'center'},
            {field:'unit_price',title:'单价',width:100,align:'right',
                formatter: function (value, row, index) {
                    return $.formatMoney(value);
            }},
            {field:'product_id',title:'小计',width:100,align:'right',
                formatter: function (value, row, index) {
                    return $.formatMoney(row.order_count * row.unit_price);
            }}
            ]]
    });
}