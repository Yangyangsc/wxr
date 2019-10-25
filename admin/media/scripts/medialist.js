var medialist, grouplist,typelist,advanceSearch=1;
var platform=["微信","微博","其他"];
var contentshow=["图文","漫画","音频","视频","其他"];
///初始化列表控件
function InitMediaGrid() {
    medialist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/media',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
        searchButton: '#btnSearch', resetButton: '#btnReset'},
        createOption: {button: '#btnNewMedia', url:'/media/mediadetail.html', icon: 'icon-Media', title: '媒体库',
             width: 920, height: 680, 
             beforeFunc: function (option) {
                var keyValue = $.isNullOrEmpty(typelist.selectedKeyValue()) ? '' : typelist.selectedKeyValue();
                if (keyValue!='') option.url = option.url + '&catalogid=' + keyValue + '&catalogname=' + escape(typelist.selectedRow()==null?'':typelist.selectedRow().name)
                return true;
        }},
        deleteOption: { button: '#btnDeleteMedia', url:'/Media' },
        excelOption:{button:'#btnExport',excelkey:'Mediainfo',fileName:'medialist.xlsx'},
        editOption: { url:  '/media/mediadetail.html',icon: 'icon-Media', title: '媒体库', width: 920, height: 680 },
        columns: [[
            { field: 'ck', checkbox: true},
            {
                 field: 'logo', title: '',align:'center', halign:'center',width: 60, formatter: function (value, row, index) {
                     var header;
                     if (!$.isNullOrEmpty(value))
                         header= "<img src='" +urlConfig.base.imageBase+value+ "' style='border:1px solid #ccc;border-radius: 20%;width:32px;height:32px;cursor:pointer'>";
                     else
                        header= "<img src='../images/media/default.png' style='border:1px solid #ccc;border-radius: 20%;width:32px;height:32px'/>";
                    return header;
                 }
            },
            {
                field: 'name', title: '媒体名称',halign:'center', width: 150, sortable: true,
                formatter: function (value, row, index) {
                    var link =  "<a href='#' onclick=\"medialist.editRecord('" + row.id + "')\">" + value + "</a>";
                    if (row.level==2) link+='&nbsp;&nbsp;<i class="badge color-important">&nbsp;优选媒体&nbsp;</i>';
                    else if (row.level==1) link+='&nbsp;&nbsp;<i class="badge">&nbsp;严选媒体&nbsp;</i>';
                    return link;
                    //return '<div style="white-space:normal;word-wrap:break-word;line-height:22px">'+link+offlineFlag+'</div>' ;
                }
            },
            { field: 'type', title: '承载平台',align:'center', width:70,sortable: true
                , formatter: function (value, row, index) {
                    if (value<2)   return platform[value];
                    return $.isNullOrEmpty(row.platform)?'其他':row.platform;
            } },
            { field: 'cname', title: '类型',halign:'center', width: 80},
             { field: 'showtype', title: '内容形式',align:'center', width:70,sortable: true
                , formatter: function (value, row, index) {
                    return contentshow[value];
            } },
            // { field: 'mediano', title: '媒体id',halign:'center', width: 90, sortable: true},
             { field: 'istop', title: '头部大号',align:'center', width: 80,sortable: true
                , formatter: function (value, row, index) {
                   if(value==1) return '头部大号';
            } },
            { field: 'fans', title: '粉丝量(万)',halign:'center',align:'right', width: 90,sortable: true},
            { field: 'avgread', title: '平均阅读量',halign:'center',align:'right', width: 90,sortable: true},
            { field: 'headread', title: '头条阅读量',halign:'center',align:'right', width: 90,sortable: true},
            { field: 'rank', title: '同类排名',halign:'center',align:'right', width: 90,sortable: true},
            { field: 'headprice', title: '投放价(头条/二条)',halign:'center', width: 150
                , formatter: function (value, row, index) {
                    var price1=value==0?'不开放':$.formatMoney(value);
                     var price2=row.secondprice==0?'不开放':$.formatMoney(row.secondprice);
                    return '<font color="red">'+price1 + '</font> / <font color="#666">' +price2+'</font>'
            } },
            { field: 'headpricecost', title: '成本价(头条/二条)',halign:'center', width: 150
                , formatter: function (value, row, index) {
                     var price1=value==0?'不开放':$.formatMoney(value);
                     var price2=row.secondpricecost==0?'不开放':$.formatMoney(row.secondpricecost);
                    return '<font color="red">'+price1+ '</font> / <font color="#666">' +price2+'</font>'
            } },
            { field: 'secondpricecost', title: '利润(头条/二条)',halign:'center', width: 150
                , formatter: function (value, row, index) {
                     var price1=row.headprice==0?'--':$.formatMoney(row.headprice - row.headpricecost);
                     var price2=row.secondprice==0?'--':$.formatMoney(row.secondprice - row.secondpricecost);
                    return '<font color="green">'+price1+ '</font> / <font color="#666">' +price2+'</font>'
            } },
            { field: 'valid', title: '报价有效期',align:'center', width: 80},
            { field: 'contribution', title: '撰稿',align:'center', width: 60, 
                    formatter: function (value, row, index) {
                        if (value==1) return '支持';
            } },
            { field: 'hosttype', title: '主体',halign:'center', width: 110
            , formatter: function (value, row, index) {
                    var hostInfo = value==0?'个人':'企业';
                    if (!$.isNullOrEmpty(row.hostname)) hostInfo+='('+row.hostname+')';
                    return hostInfo;
                } 
            },
            { field: 'operator', title: '联系方式',halign:'center', width: 110
            , formatter: function (value, row, index) {
                    var contactInfo = '';
                    if (!$.isNullOrEmpty(value)) contactInfo+='运营账号:'+value+'<br>';
                    if (!$.isNullOrEmpty(row.telephone)) contactInfo+='联系电话:'+row.telephone;
                    return contactInfo;
                } 
            }
        ]]
    });
}
function showAdvanceSearch(){
    if (advanceSearch==0){
        $('.advance').fadeIn();
        $('#spanAdvance').text('隐藏');
        advanceSearch=1;
    }
    else{
         $('.advance').fadeOut();
        $('#spanAdvance').text('高级');
        advanceSearch=0;
    }
}
function initMediaTypeGrid(){
    typelist = new listForm('dgContentType', {
        //title: '应用系统列表',
        url: '/media/catalog',
        idField: 'id',
        toolbar: '#tools_2',
        pagination: false,
        showHeader:false,
        onLoadSuccess:function(data){
             $('#dgContentType').datagrid('insertRow',{
                        index: 0,	// 索引从0开始
                        row: {id:'',name: '全部'}
                    });
        },
        onSelect: function (rowIndex, rowData) {
            medialist.loadData({ typeid: rowData.id });
        },
        columns: [[
            { 
                field: 'name', title: '名称', width: 180,
                formatter: function (value, row, index) {
                    if(!$.isNullOrEmpty(row.id) && row.totalcount>0)   return value+'&nbsp;&nbsp;<i class="badge color-important">&nbsp;'+row.totalcount+'&nbsp;</i>';
                    return value;
                    
                } 
             }
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    initMediaTypeGrid();
    InitMediaGrid();
     showAdvanceSearch();
});


function reloadMedia() {
    medialist.reload();
}



