var consumeList;
function InitConsumeGrid(){
    if (consumeList != null) return;
    consumeList = new listForm('dg', {
        url: '/consume/memberorder',
        toolbar: '#tools_Consume',
        idField:'id',
        showFooter: true,
        searchOption: {
        searchButton: '#btnSearch', resetButton: '#btnReset'},
        excelOption:{button:'#btnOrderExcel',excelkey:'joinMemberOrder',fileName:'memberlist.xlsx'},
        rownumbers:true,
        showFooter:true,
        columns: [[
            { field: 'paydate', title: '入会日期',halign:'center',sortable:true, width: 140 },
            { field: 'orderno', title: '订单编号',halign:'center', width: 90 },
            { field: 'username', title: '用户', halign:'center',sortable:true,width: 190, 
                 formatter: function (value, row, index) {
                     if ($.isNullOrEmpty(value))return;
                     var retUser;
                     if (!$.isNullOrEmpty(row.image))
                        retUser= "<img src='" +urlConfig.base.imageBase+row.image+ "' style='width:30px;border:1px solid #CCC;border-radius: 50%;vertical-align:middle;'>";
                    else
                        retUser= "<img src='../images/member/default.png' style='border:1px solid #ccc;border-radius: 50%;width:30px;height:30px;vertical-align:middle;'/>";
                      retUser+='<span style="padding-left:5px;">'+value+'('+row.mobile+')</span>';
                      return retUser;
                 }
             },
            { field: 'member', title: '会员类型',halign:'center',sortable:true, width: 110 },
            { field: 'guider', title: '引流用户',halign:'center',sortable:true, width: 110 },
            { field: 'total', title: '会员费用',align:'right',sortable:true, width: 90 ,
                formatter: function (value, row, index) {
                    if (value>0) return $.formatMoney(value);
                    return '-'
            } }
        ]]
    });
}

$(document).ready(function () {
    InitConsumeGrid();
});


