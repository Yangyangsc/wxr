var detailForm,lstTickets,activityid;
$(document).ready(function () {
    activityid = $.getUrlParam('activityid');
    $('#tabChannel').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitGiftTickets(); break;
            }
        }
    });
    detailForm = new detailForm('formChannel', {
         initForm:function(){
            $('#tabChannel').tabs('close',2).tabs('close',1);
        },
        bindOption: { url: '/activitychannel' },
        saveOption: {
            button: '#lnkSave', url:'/activitychannel',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadChannel');
                    $.redirect('channeldetail.html?activityid='+activityid+'&actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
});

function InitGiftTickets(){
    if(lstTickets) return;
     lstTickets = new listForm('dgTicket', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveGift', url: '/channelgift/',successFunc: function () {
                lstTickets.removeRow();
            }
        },
        createOption: { button: '#lnkAddGift', url:'/activity/channelgift.html?activityid='+activityid+'&channelid='+detailForm.getCurrentKey(), icon: 'icon-ticket', title: '渠道赠票', width: 580, height: 420, callbackFunc: { reload: function () { lstTickets.reload(); }} },
        editOption: { url: '/activity/channelgift.html?activityid='+activityid, icon: 'icon-ticket', title: '渠道赠票设置', width: 580, height: 420 },
        iconCls: 'icon-ticket',
        doubleClickEdit:true,
        url: '/activitychannel/'+detailForm.getCurrentKey()+'/gifts',
        idField: 'id',
        toolbar: '#tools_Ticket',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'title', title: '票面名称', width: 140 ,halign:'center',formatter: function (value, row, index) {
                    return '<span class="ident-tag" style="margin-left:5px;background:'+row.bgcolor+';">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;<b>'+value +'</b>';
                    } 
            },
            { field: 'count', title: '赠送数量', width: 65,halign:'center',align:'center',formatter: function (value, row, index) {
                    if (value==0) return '<span style="margin-left:5px;" class="ident-tag status-idented">不限</span>';
                    return value;
                } 
            },
            { field: 'memo', title: '备注说明', width: 140 ,halign:'center'},
            { field: 'ck', title: '赠票链接', width: 320 ,halign:'center',formatter: function (value, row, index) {
                var fullUrl=urlConfig.base.activityRoot+'?activityid='+activityid+'&giftid='+row.id;
                return fullUrl+
                    '<br/><a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'$.copytext("'+fullUrl+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">复制</span><span class="l-btn-icon icon-copy">&nbsp;</span></span></a>';
            } },
            { field: 'price', title: '面值价格', width: 90,halign:'center',align:'center',formatter: function (value, row, index) {
                    return $.formatMoney(value);
                } 
            }
            
        ]]
    });
}