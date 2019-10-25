var detailForm;
function getSystemSetting() {
    detailForm = new detailForm('formSetting', {
        bindOption: {
            url: '/SystemSetting/', successFunc: function (retData) {
                if(retData.json)
                {
                    var result =JSON.parse(retData.json);
                    $('#formSetting').form('load', result);
                }
                // if (result.guideenable)
                //     $('#guideenable').val("true");
                // else
                //     $('#guideenable').val("false");
                // if (result.update)
                //     $('#update').val("true");
                // else
                //     $('#update').val("false");
                // if (result.force)
                //     $('#force').val("true");
                // else
                //     $('#force').val("false");

                // if (result.invite)
                //     $('#invite').val("true");
                // else
                //     $('#invite').val("false");

                // if (result.payfunc)
                //     $('#payfunc').val("true");
                // else
                //     $('#payfunc').val("false");

                // if (result.openmall)
                //     $('#openmall').val("true");
                // else
                //     $('#openmall').val("false");
                switchGuide();
            }
        },
        saveOption: {button: '#lnkSave', url: '/SystemSetting'}
    });
    detailForm.bindForm();
}

// ,beforeFunc:function(saveOpt){
//             saveOpt.data={
//                 json:JSON.stringify(saveOpt.data)
//             }
//             //alert(JSON.stringify(saveOpt.data));
//             return true;
//         }
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    getSystemSetting();
});

function writeJson() {
    dataForm.doAction({
        method: 'post', url: '/SystemSetting/writefile', prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function writePcrJson() {
    dataForm.doAction({
        method: 'post', url: 'SystemSetting.aspx', action: 'WritePCRInfo', value: null, prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function writeCityJson() {
    dataForm.doAction({
        method: 'get', url: 'SystemSetting.aspx', action: 'WriteCityJson', value: null, prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function writeHierarchialJson(datatype) {
    dataForm.doAction({
        method: 'get', url: 'SystemSetting.aspx', action: 'WriteHierarchialJson', value: { type: datatype }, prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}


function writeInformation() {
    dataForm.doAction({
        method: 'get', url: '../Portal/Information.aspx', 
        action: 'WriteCategory&datakey=infocategory', 
        data: null,
        prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function writeGoodsCategory() {
    dataForm.doAction({
        method: 'get', url: '../Mall/GoodsInfo.aspx',
        action: 'WriteCategory&datakey=goodscategory',
        data: null,
        prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function writeOrganization() {
    dataForm.doAction({
        method: 'get', url: 'SystemSetting.aspx',
        action: 'WriteOrganization',
        data: null,
        prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function writeCompany() {
    dataForm.doAction({
        method: 'get', url: 'SystemSetting.aspx',
        action: 'WriteCompany',
        data: null,
        prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}

function switchGuide()
{
    if ($('#guideenable').val() == 'true')
        $('#trGuide').show();
    else
        $('#trGuide').hide();
}

function SendIM()
{
    dataForm.doAction({
        method: 'get', url: 'SystemSetting.aspx',
        action: 'SendSettingToAllUser',
        data: null,
        prompt: false
    });
}