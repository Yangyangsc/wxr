var detailForm, imgCover,imgShare;
var lstTickets,lstChannels;
var disableFlag=["status-identing","status-failed"];
var TicketdisableText=["可选","停止"];
var ChanneldisableText=["正常","停止"];
var ticketNewUrl='/activity/ticketdetail.html';
var channelNewUrl='/activity/channeldetail.html';
$(document).ready(function () {
    
    ApiCaller.Get({url:'/activitycatalog',successFunc:function(result){
        // formHelper.bindCombo({bindControl:'actCatalog',
        //                   valueField:'id',
        //                   textField:'name',
        //                   url:'/activitycatalog',
        //                   bindData:result.rows
        //                 });
        // $('#actCatalog').combobox('validate');
        result.rows.forEach(function(value,index){
            $("#actCatalog").append("<option value='"+value.id+"'>"+value.name+"</option>");
        });
        $.bindMemberType2TagBox({tagbox:'actMembers',
                                prompt:'请选择适用会员',
                                successFunc:function(){initForm();}});
        // $('#actMembers').combobox('onSelect',function(r){
        //     ///用户选择了全部，则取消所有的
        //     if (r.id=='')
        //         $('#actMembers').combobox('clear');
        //     else
        //         $('#actMembers').combobox('unselect','');
        // })
        
    }})
    
})
///选择标签为活动定义
function setActivitylable(result){
    if (!result) return;
    var existedLabelid =[] ;
    if ($('#labelid').val()!='' ) existedLabelid = $('#labelid').val().split(',');
    var labelNames =[];
     if ($('#realLabel').val()!='' ) labelNames = $('#realLabel').val().split(',');
    result.forEach(function(item){
        if (existedLabelid.indexOf(item.id+"")>=0) return;
        existedLabelid.push(item.id+"");
        labelNames.push(item.text);
    })
    $('#labelid').val($.removeStartPrefix(',',existedLabelid.join(',')));
    $('#realLabel').val($.removeStartPrefix(',',labelNames.join(',')));
    $('#labelInput').tagbox('setValues',labelNames);
   
}
function initForm(){
    $('#tabActivity').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 2: InitTickets(); break;
                case 3: InitChannels(); break;
            }
        }
    });
     var ue = UE.getEditor('editor',{
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        enableAutoSave: false,
        elementPathEnabled: false,
        wordCount: false
    });
    formHelper.initializePopup();
    imgCover= new uploader('imgCover',{fileKey:'activitycover',refControl:{contentControl:'activityCover',imageControl:'imgCover'}});
    imgShare= new uploader('imgShare',{fileKey:'activitycover',refControl:{contentControl:'activityShare',imageControl:'imgShare'}});
    detailForm = new detailForm('formActivity', {
        initForm:function(){
            $('#catalogname').textbox('setValue',$.getUrlParam('catalogname')); 
            $('#catalogname').textbox('validate');
            $('#catalogid').val($.getUrlParam('catalogid'));
            $('#tabActivity').tabs('close',2).tabs('close',2);
        },
        bindOption: {
            url: '/activity/', successFunc: function (result) {
                 ticketNewUrl=ticketNewUrl+'?activityid='+result.id;
                 channelNewUrl=channelNewUrl+'?activityid='+result.id;
                ///延迟500毫秒设置富文本内容，防止报错
                if (!$.isNullOrEmpty(result.richtext)) setTimeout(function(){ue.setContent(result.richtext);},500); 
                if (!$.isNullOrEmpty(result.cover))
                    $('#imgCover').attr('src', urlConfig.base.imageBase + result.cover);
                if (!$.isNullOrEmpty(result.share))
                    $('#imgShare').attr('src', urlConfig.base.imageBase + result.share);
                ///设置文章标签
                if(!$.isNullOrEmpty(result.label)){
                    $('#labelInput').tagbox('setValues',result.label.split(','));
                }
                ///设置适用会员
                if(!$.isNullOrEmpty(result.formember)){
                    $('#actMembers').tagbox('setValues',result.formember.split(','));
                }
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/activity',
            beforeFunc:function(option){
                ///判断结束日期不能大于开始日期
                var endDate = $('#dtend').datetimebox('getValue');
                var startDate = $('#dtstart').datetimebox('getValue');
                if ($('#activityCover').val().length<=0){
                    $.messager.alert('错误提示', '请上传活动封面!', 'info');
                    return false;
                }
                if (Date.parse(endDate)<Date.parse(startDate)){
                    $.messager.alert('错误提示', '活动结束日期不能早于开始日期!', 'info');
                    return false;
                }
                ///保存适用会员
                var forMember = $('#actMembers').combobox('getValues');
                //alert(forMember.join(','));
                $('#hidMembers').val(forMember.join(','));
                ///验证标签的数量不要多于6个
                var tags = $('#labelInput').tagbox('getValues');
                if (tags!=null && tags.length>6) {
                    $.messager.alert('提示','标签数量不要超过6个,不便于精准识别','info');
                    return false;
                }
                $('#realLabel').val(tags.join(','));

                
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadactivity');
                    $.redirect('activitydetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
}


function InitTickets(){
    if(lstTickets) return;
     lstTickets = new listForm('dgTicket', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveTicket', url: '/activityticket/',successFunc: function () {
                lstTickets.removeRow();
            }
        },
        createOption: { button: '#lnkAddTicket', url:ticketNewUrl , icon: 'icon-ticket', title: '活动票务设置', width: 780, height: 550, callbackFunc: { reload: function () { lstTickets.reload(); }} },
        editOption: { url: '/activity/ticketdetail.html', icon: 'icon-ticket', title: '活动票务设置', width: 780, height: 550 },
        doubleClickEdit:true,
        url: '/activity/'+detailForm.getCurrentKey()+'/tickets',
        idField: 'id',
        toolbar: '#tools_Ticket',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            
            { field: 'title', title: '票面名称', width: 220 ,halign:'center',formatter: function (value, row, index) {
                    return '<span class="ident-tag" style="margin-left:5px;background:'+row.bgcolor+';">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;<b>'+value +'</b>';
            } },
            { field: 'gift', title: '类型', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
                    if (value==1) return '<span style="margin-left:5px;" class="ident-tag status-orange">赠票</span>';
                    return '<span style="margin-left:5px;" class="ident-tag status-green">销售票</span>';;
                } },
            { field: 'price', title: '票面价格', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
                    return $.formatMoney(value);
                } },
            { field: 'disprice', title: '促销价格', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
                    return $.formatMoney(value);
                } },
            { field: 'memberprice', title: '会员价格', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
                    return $.formatMoney(value);
                } },
             { field: 'max', title: '最大数量', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
                    if (value==0) return '<span style="margin-left:5px;" class="ident-tag status-idented">不限</span>';
                    return value;
                } },
            
             { field: 'disabled', title: '可选状态', width: 90,halign:'center',align:'center',
                formatter: function (value, row, index) {
                     return '<span style="margin-left:5px;" class="ident-tag '+disableFlag[value]+'">'+TicketdisableText[value]+'</span>';
                }
            }
        ]]
    });
}

function copyTextChannelUrl(id){
    var fullUrl = urlConfig.base.activityRoot+'?activityid='+detailForm.getCurrentKey()+'&channelid='+id;
    $.copytext(fullUrl);   
}
function InitChannels(){
    if(lstChannels) return;
     lstChannels = new listForm('dgChannel', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveChannel', url: '/activitychannel/',successFunc: function () {
                lstChannels.removeRow();
            }
        },
        doubleClickEdit:true,
        createOption: { button: '#lnkAddChannel', url:channelNewUrl , icon: 'icon-channel', title: '合作渠道管理', width: 780, height: 450, callbackFunc: { reload: function () { lstTickets.reload(); }} },
        editOption: { url: '/activity/channeldetail.html?activityid='+detailForm.getCurrentKey(), icon: 'icon-channel', title: '合作渠道管理', width: 780, height: 450 },
        excelOption:{button:'#btnChannel',excelkey:'activitychannel',fileName:'合作渠道.xlsx'},
        iconCls: 'icon-edit',
        url: '/activity/'+detailForm.getCurrentKey()+'/channels',
        idField: 'id',
        toolbar: '#tools_Channel',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'name', title: '渠道名称', width: 120 ,halign:'center'},
             { field: 'ck', title: '专属推广链接', width: 340 ,halign:'center',formatter: function (value, row, index) {
                     var fullUrl=urlConfig.base.activityRoot+'?activityid='+detailForm.getCurrentKey()+'&channelid='+row.id;
                     return fullUrl+
                         '<br/><a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'$.copytext("'+fullUrl+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">复制</span><span class="l-btn-icon icon-copy">&nbsp;</span></span></a>';
                 } },
            //{ field: 'linkUrl', title: '渠道购票链接', width: 340 ,halign:'center',formatter: function (value, row, index) {
             //       var fullUrl=urlConfig.base.activityRoot+'?activityid='+detailForm.getCurrentKey()+'&channelid='+row.id;
              //      return value+
               //         '<br/><a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'$.copytext("'+value+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">复制</span><span class="l-btn-icon icon-copy">&nbsp;</span></span></a>';
            //    } },
            { field: 'discount', title: '渠道折扣', width: 90,halign:'center',align:'center',
                    formatter: function (value, row, index) {
                        if (value==100) return '<span style="margin-left:5px;" class="ident-tag status-idented">无优惠</span>';
                    return '<b><font color="red">'+value+' %</font> </b>';
                }  
            },
            //  { field: 'max', title: '优惠数量', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
            //         if (value==0) return '<span style="margin-left:5px;" class="ident-tag status-idented">无限</span>';
            //         return value;
            //     } },
             { field: 'disabled', title: '合作状态', width: 90,halign:'center',align:'center',
                formatter: function (value, row, index) {
                     return '<span style="margin-left:5px;" class="ident-tag '+disableFlag[value]+'">'+ChanneldisableText[value]+'</span>';
                }
            }
        ]]
    });
}

function reloadChannel(){
    lstChannels.reload();
}