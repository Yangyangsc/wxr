var detailForm, serviceList, appList, imgLogo;
$(document).ready(function () {
    $('#startdate').datebox({
        onSelect: function (date) {
            var endDate = new Date(date);
            endDate.setFullYear(endDate.getFullYear() + 1);
            $('#enddate').datebox('setValue', endDate.toLocaleString());
        }
    });
    ApiCaller.Get({
        url: '/dictionary/subitems?name=business',
        successFunc: function (result) {
            result.rows.unshift({ rec_id: '', item_name: '请选择行业' });
            formHelper.bindCombo({
                combobox: 'comBusiness',
                data: result.rows,
                valueField: 'rec_id',
                textField: 'item_name'
            });
        }
    });

    $('#tabEnterprise').tabs({
        onSelect: function (title, index) {
            switch (index) {
                case 1: InitEnterpriseServiceGrid(); break;
                case 2: InitEnterpriseAppServiceGrid(); break;
            }
        }
    });
    $("input", $("#loginid").next("span")).blur(validatorloginName);
    formHelper.initializePopup();
    imgLogo = new uploader('imgLogo', { fileKey: 'enterpriselogo', refControl: { contentControl: 'entLogo', imageControl: 'imgLogo' } });
    detailForm = new detailForm('formEnterprise', {
        initForm: function () {
            $('#tabEnterprise').tabs('close', 2).tabs('close', 1);
        },
        bindOption: {
            url: '/enterprise/', successFunc: function (result) {
                $("#loginid").attr("readonly", 'readonly');
                if (!$.isNullOrEmpty(result.image))
                    $('#imgLogo').attr('src', urlConfig.base.imageBase + result.image);
            }
        },
        saveOption: {
            button: '#lnkSave', url: '/enterprise',
            beforeFunc: function () {
                if (loginIdExistFlag) {
                    $.messager.alert('提示', '登录帐号重复，请重新输入.', 'info');
                    return false;
                }
                return true;
            },
            successFunc: function (result) {
                if (detailForm.getCurrentAction() == 'addnew') {
                    dialogHelper.callParentFunc('reloadMember');
                    $.redirect('enterprisedetail.html?actionType=edit&key=' + result.id + '&random=' + Math.random());
                }
                else {
                    dialogHelper.closeModal(result);
                }
            }
        }
    });
    detailForm.bindForm();

})

///初始化列表控件
function InitEnterpriseServiceGrid() {
    if (serviceList != null) return;
    serviceList = new listForm('dgService', {
        //title: '应用系统列表',
        deleteOption: {
            button: '#lnkRemoveRole', url: '/enterprise/service', successFunc: function () {
                serviceList.removeRow();
            }
        },
        iconCls: 'icon-edit',
        url: '/enterprise/' + detailForm.getCurrentKey() + '/service',
        idField: 'rec_id',
        toolbar: '#tools_1',
        pagination: false,
        rownumbers: true,//行号 
        onLoadSuccess: function (data) {
            $('.numberBox').numberbox({ min: 0, max: 9999 });
            $('#dgService').datagrid('fixRowHeight');
        },
        columns: [[
            { field: 'name', title: '服务名称', width: 300, halign: 'center' },
            {
                field: 'remain', title: '数量', width: 120, align: 'center', halign: 'center',
                formatter: function (value, row, index) {
                    var countInput = '<input type="text" id="count_' + row.rec_id + '" class="numberBox" value="' + value + '" />';
                    //var saveButton ='<a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'setCount("'+row.rec_id+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">保存</span><span class="l-btn-icon icon-save"></span></span></a>';
                    return countInput; //+ saveButton;
                }
            }
        ]]
    });
}
function batchUpdateCount() {
    var skuItems = serviceList.getRows();
    if (skuItems.length > 0) {
        var rowdata = [];
        skuItems.forEach(function (skuRow) {
            var count = $('#count_' + skuRow.rec_id).numberbox('getValue');
            rowdata.push('(' + skuRow.rec_id + ',\''
                + skuRow.entid + '\',\''
                + skuRow.serviceid + '\','
                + $.checkValue(count, 0) + ')');
        });
        if (rowdata.length > 0)

            ApiCaller.Put({
                url: '/enterprise/batchupdateservice',
                data: { updateData: rowdata.join(',') },
                successFunc: function (result) {
                    $.messager.alert('提示', '服务数量已更新!', 'info');
                }
            })
    }
}
///初始化列表控件
function InitEnterpriseAppServiceGrid() {
    if (appList != null) return;
    appList = new listForm('dgAppService', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/enterprise/' + detailForm.getCurrentKey() + '/appservice',
        idField: 'id',
        toolbar: '#tools_AppService',
        pagination: false,
        rownumbers: true,//行号 
        columns: [[
            { field: 'date', title: '申请时间', width: 110, halign: 'center' },
            { field: 'servicename', title: '申请的服务', width: 140, halign: 'center' },
            { field: 'targetname', title: '对象名称', width: 120, halign: 'center' },
            {
                field: 'status', title: '处理状态', width: 90, align: 'center', halign: 'center',
                formatter: function (value, row, index) {
                    return ['未处理', '已完成', '预约失败'][value];
                }
            }
        ]]
    });
}

var loginIdExistFlag = false;
function validatorloginName() {
    var loginName = $('#loginid').val();
    if ($.trim(loginName) == '') return;
    ApiCaller.Post({
        url: '/enterprise/checkaccount', data: { account: loginName },
        successFunc: function (result) {
            if (result.successed && !result.existed) {
                $('#errormessage').html("<img src='../images/ticked.png'/><font color='green'>账号可用</font>");
                loginIdExistFlag = false;
            }
            else {
                $('#errormessage').html("<img src='../images/no.png'/><font color='red'>账号重复</font>");
                loginIdExistFlag = true;
            }
        }
    });
}

function process() {
    var appItem = appList.selectedRow();
    if (!appItem) {
        $.messager.alert('提示', '请选择预约记录.', 'info');
        return;
    }
    if (appItem.status > 0) {
        $.messager.confirm('询问', '该预约已被标记处理,确认需要修改处理结果?', function (r) {
            if (r) doProcess(appItem.id);
        });
    }
    else
        doProcess(appItem.id);

}
///处理预约单
function doProcess(id) {
    dialogHelper.showModal({
        title: '预约处理',
        url: './brh/dateprocess.html?appid=' + id, width: 600, height: 350,
        closeFunc: function (result) {
            if (result) {
                appList.reload();
            }
        }
    });
}


function addServices() {
    formHelper.popupSelect({ url: '../CommonSelect/CommonSelector.html?enterprise_id=' + detailForm.getCurrentKey(), title: '添加服务', datakey: 'addservice', multiselect: true, width: 450, height: 530, afterSelectFunc: cs_SelectServices, icon: 'icon-role' });
}


function cs_SelectServices(itemData) {
    if (itemData && itemData.length > 0) {
        var serviceSql = [];
        itemData.forEach(function (item) {
            serviceSql.push('(\'' + detailForm.getCurrentKey() + '\',\'' + item.id + '\',1)')
        })
        var url = '/enterprise/addservice';
        ApiCaller.Post({
            url: url, data: { serviceData: serviceSql.join(',') },
            successFunc: function (result) {
                serviceList.reload();
            }
        });
    }
}