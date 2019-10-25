var detailForm, grouplistForm,consumeList,memberList,workList,labelList;

$(document).ready(function () {
    $('#tabmember').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1: userPortrait(); break;
                case 2: InitUserMembers(); break;
                case 3: initUserWorkExperience(); break;
                case 4: InitUserGroupGrid(); break;
                case 5: InitUserConsume(); break;
            }
        }
    });
    formHelper.initializePopup();
    //imgHeader= new uploader('imgHead',{fileKey:'userheader',refControl:{contentControl:'memberHead',imageControl:'imgHead'}});
    detailForm = new detailForm('formMember', {
        bindOption: {
            url: '/member/', successFunc: function (result) {
                if (!$.isNullOrEmpty(result.image))
                    $('#imgHead').attr('src', urlConfig.base.imageBase + result.image);
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/member',
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadMember');
                    $.redirect('memberdetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();
})
///用户画像
function userPortrait(){
    if (labelList) return ;
    labelList = new listForm('dgLabel', {
        url: '/userlabel?userid=' + detailForm.getCurrentKey(),
        toolbar: '#tools_Label',
        createOption: { button: '#lnkAddLabel', url:'/crm/userlabel.html?userid='+detailForm.getCurrentKey(), title: '用户标签', width: 550, height: 330,callbackFunc: { reload: function () { labelList.reload(); }} },
        editOption: { url: '/crm/userLabel.html', title: '用户标签', width: 550, height: 330 },
        deleteOption: { button: '#lnkRemoveLabel', url: '/userlabel/' },
        doubleClickEdit:true,
        pagination: false,
        rownumbers:true,
        idField:'id',
        columns: [[
            { field: 'label', title:'标签',halign:'center', width: 60 },
            { field: 'count', title:'指标',halign:'center', width: 40 }
        ]]
    });
    paintUserLabelChart();
}
function paintUserLabelChart(){
    ApiCaller.Get({url:'/member/'+detailForm.getCurrentKey()+'/label',
                successFunc:function(result){
                    portraited = true;
                    var data=[];
                    result.rows.forEach(function(item,index){
                        var serialItem = [];
                        serialItem.push(item.label);
                        serialItem.push(item.count);
                        data.push(serialItem);
                    })
                    charts.render3dDonut({chartContainer:'chartContainer',data:data,serialName:'兴趣指数',title:'用户兴趣分析'})
            }
    })
}
///初始化列表控件
function InitUserGroupGrid() {
    if (grouplistForm != null) return;
    grouplistForm = new listForm('dgGroups', {
        iconCls: 'icon-edit',
        url: '/member/' + detailForm.getCurrentKey()+'/groups',
        toolbar: '#tools_Group',
        pagination: false,
        rownumbers:true,
        idField:'group_id',
        columns: [[
            { field: 'group_name', title:'群组名称', width: 130 },
            { field: 'join_date', title:'入群日期', width: 110 },
            { field: 'group_title', title:'群职位', width: 90 }
        ]]
    });
}

function initUserWorkExperience(){
    if (workList != null) return;
    workList = new listForm('dgWE', {
        iconCls: 'icon-edit',
        url: '/workexperience?userid=' + detailForm.getCurrentKey(),
        toolbar: '#tools_we',
        createOption: { button: '#lnkAddWE', url:'/crm/workexperience.html?userid='+detailForm.getCurrentKey(), title: '工作履历', width: 620, height: 450,callbackFunc: { reload: function () { workList.reload(); }} },
        editOption: { url: '/crm/workexperience.html', title: '工作履历', width: 620, height: 450 },
        deleteOption: { button: '#lnkRemoveWE', url: '/workexperience/' },
        doubleClickEdit:true,
        pagination: true,
        rownumbers:true,
        idField:'rec_id',
        columns: [[
            { field: 'company', title:'工作单位',halign:'center', width: 180 },
            { field: 'startdate', title:'工作时间',halign:'center', width: 140,
                formatter:function(value,row,index){
                    var timeline = '';
                    if ($.isNullOrEmpty(value) && $.isNullOrEmpty(row.leavedate)) return '--'
                    if (!$.isNullOrEmpty(value) && !$.isNullOrEmpty(row.leavedate)) return value + ' 至 '+row.leavedate;
                    if ($.isNullOrEmpty(value)) timeline='-- 至 '+row.leavedate;
                    return  value + ' 至今';
                } },
            { field: 'department', title:'工作部门',halign:'center', width: 90 },
            { field: 'position', title:'工作岗位',halign:'center', width: 80 },
            { field: 'status', title:'在职状态',align:'center', width: 80,
                formatter:function(value,row,index){
                    if (value==0) return '离职';
                    if (value==1) return '在职';
                    return '休假';
                }
            },
        ]]
    });
}

function InitUserMembers(){
    if(memberList) return;
     memberList = new listForm('dgMembers', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveMember', url: '/member/usermember',successFunc: function () {
                memberList.removeRow();
            }
        },
        createOption: { button: '#lnkAddMember', url:'/crm/usermember.html?userid='+detailForm.getCurrentKey() , title: '会员设置', width: 620, height: 450,callbackFunc: { reload: function () { memberList.reload(); }} },
        editOption: { url: '/crm/usermember.html', title: '会员设置', width: 620, height: 450 },
        doubleClickEdit:true,
        url: '/member/'+detailForm.getCurrentKey()+'/membertype',
        idField: 'rec_id',
        toolbar: '#tools_Member',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'member_name', title: '会员', width: 150 ,halign:'center'},
            { field: 'join_date', title: '入会日期', width: 120 ,align:'center'},
            { field: 'valid_forever', title: '有效期', width: 170,halign:'center',align:'center',
                formatter: function (value, row, index) {
                    if (value==1) return '永久';
                    return row.valid_start + ' 至  ' + row.valid_end;
                } },
            { field: 'user_guide_name', title: '推荐人', width: 90,align:'center'}
        ]]
    });
}
function InitUserConsume(){
    if (consumeList != null) return;
    consumeList = new listForm('dgConsume', {
        //url: '/member/' + detailForm.getCurrentKey()+'/consume',
        url: '/consume?userid=' + detailForm.getCurrentKey(),
        toolbar: '#tools_Consume',
        idField:'id',
        showFooter: true,
        searchOption: {
        searchButton: '#btnSearch', resetButton: '#btnReset'},
        rownumbers:true,
        columns: [[
            { field: 'paydate', title: '消费日期',halign:'center', width: 140 },
            { field: 'orderno', title: '订单编号',halign:'center', width: 90 },
            { field: 'type', title: '消费类型',align:'center', width: 110,
                formatter: function (value, row, index) {
                    return lmh_const.PAYMENT_TYPE[value];
                } },
           
            { field: 'total', title: '消费金额',align:'right', width: 90 ,
                formatter: function (value, row, index) {
                    if (value>0) return $.formatMoney(value);
                    return '-'
            } },
            { field: 'memo', title: '备注',halign:'center', width: 190 }
           
        ]]
    });
}
function joinGroup() {
    formHelper.popupSelect({ param:{user_id:detailForm.getCurrentKey()}, title: '加入群', datakey: 'addmembergroup', multiselect: true, width: 450, height: 530, afterSelectFunc: cs_joinGroup, icon: 'icon-role' });
}

function cs_joinGroup(itemData) {
    if (itemData && itemData.length>0) {
        var groupKeys = '';
        for (var nLoop=0;nLoop<itemData.length;nLoop++) {
            var nItem = itemData[nLoop];
            groupKeys=groupKeys+nItem.id+',';
        }
        if (groupKeys.length<=0) return;
        groupKeys = groupKeys.substr(0,groupKeys.length-1);
        var url = '/member/joingroup';
        ApiCaller.Post({url:url,data:{userid:detailForm.getCurrentKey(),groupid:groupKeys},
                        successFunc:function (result) {
                             for (var nLoop=0;nLoop<itemData.length;nLoop++) {
                                var nItem = itemData[nLoop];
                                grouplistForm.appendRow({group_id:nItem.id, group_name: nItem.name,join_date:result.joindate,group_title:'成员' });
                            }
        }});
    }
}
function removeGroup(){
    if (grouplistForm!=null){
        var groupId = grouplistForm.selectedKeyValue();
        if ($.isNullOrEmpty(groupId)){
            $.messager.alert('提示','请选择需要移除的群!','info');
            return;
        }
        $.messager.confirm('删除确认','确认要将用户移出选择的群吗?',function(r){
            if (r){
                var url = '/member/removegroup';
                ApiCaller.Delete({url:url,
                                data:{userid:detailForm.getCurrentKey(),groupid:groupId},
                                successFunc:function (result) {
                                    if (result.successed)
                                        grouplistForm.removeRow();
                                    else
                                         $.messager.alert('失败','记录删除失败!','info');
                                }
                });
            }
        });
        
    }
}
