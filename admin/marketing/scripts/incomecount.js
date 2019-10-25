var consumeList;
var currentMonth;
var constMonth=["01","02","03","04","05","06","07","08","09","10","11","12"];
function InitCountGrid(ym){
    if (consumeList != null) {
        $('#dg').datagrid('load',{ym:ym});
        return;
    }
    consumeList = new listForm('dg', {
        url: '/consume/countym',
        toolbar: '#tools_Consume',
        queryParams:{ym:ym},
        //idField:'id',
        showFooter: true,
        // searchOption: {
        // searchButton: '#btnSearch', resetButton: '#btnReset'},
        rownumbers:true,
        showFooter: true,
        columns: [[
            { field: 'describ', title: '名称',halign:'center',sortable:true, width: 250,
                formatter: function (value, row, index) {
                    if (value=="合计") return value;
                    if (row.ordertype==1) return '【活动】'+value; 
                    return '【入会】'+value; 
            } },
            { field: 'ym', title: '年月',halign:'center',sortable:true, width: 110 },
            { field: 'income', title: '收入',halign:'center',align:'right', width: 140,
                formatter: function (value, row, index) {
                     return $.formatMoney(value);
                 }
             }
        ]]
    });
}

$(document).ready(function () {
    ///获取到当前年份
    //$('.easyui-linkbutton').bind('click',execQuery(this));
    
    var currentYear = new Date().getFullYear();
    var yearData = [];
    for(var nloop=2017;nloop<=currentYear;nloop++)
        yearData.push({id:nloop+"",text:nloop+""});
    formHelper.bindCombo({data:yearData,combobox:'selYear'});
    
    var mIndex =[new Date().getMonth()+1];
    
    $('#m'+mIndex).linkbutton('select');
    currentMonth = constMonth[mIndex-1];

    $('#selYear').combobox({onChange:function(value){
        execQuery();
    }})
    $('#selYear').combobox('setValue',currentYear+"");
    //alert(currentYear);
   
    //var query = currentYear+""+currentMonth;
    //InitCountGrid(query);
});

function execQuery(month){
    if (month) currentMonth = constMonth[month-1];
     var currentYear = $('#selYear').combobox('getValue');
     var query = currentYear+""+currentMonth;
     InitCountGrid(query);
}


