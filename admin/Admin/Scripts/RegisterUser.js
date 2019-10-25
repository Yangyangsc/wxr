$(function () {
    bindSend();
})

var bindSend = function () {
    $("#btnSend").click(function () {
        send();
    })
}
var isMobile = function (val) {
    if (val && val.length == 11) {
        return true;
    }
    else {
        return false;
    }
}
var send = function () {

    var validate = $("#editForm").form("validate");
    if (!validate) {
        $.messager.alert("消息提醒", "请检查你输入的数据!", "warning");
        return;
    } else {
        var numbers = $("#numbers").val();
        var names = $("#names").val();
        var positions = $("#positions").val();
        var orgnames = $("#orgnames").val();
        var telphones = $("#telphones").val();
        var numberArray = numbers.split("\n");
        var nameArray = names.split("\n");
        var positionArray = positions.split("\n");
        var orgnameArray = orgnames.split("\n");
        var telphoneArray = telphones.split("\n");
        if (nameArray.length != numberArray.length) {
            $.messager.alert('提示', '手机号码数量与用户名称数量不同', 'info');
            return;
        }
        if (numberArray.length != positionArray.length) {
            $.messager.alert('提示', '手机号码数量与职位数量不同', 'info');
            return;
        }
        if (numberArray.length != orgnameArray.length) {
            $.messager.alert('提示', '手机号码数量与机构数量不同', 'info');
            return;
        }
        if (numberArray.length != telphoneArray.length) {
            $.messager.alert('提示', '手机号码数量与联系电话数量不同', 'info');
            return;
        }
        $("#log").val('');
        var send = $("#chkSend").is(":checked") ? 1 : 0;
        var message = $("#message").val();
        $.each(numberArray, function (i, num) {
            var data = {
                mobile: num,
                name: nameArray[i],
                orgname: orgnameArray[i],
                position: positionArray[i],
                telphone: telphoneArray[i],
            };
            if (!isMobile(num)) {
                log("用户：" + data.name + "，手机号码：" + data.mobile + "不符合规则");
            }
            else {
                addUser(data, send, message);
            }

        })

        //提交
    }
}
var addUser = function (data, send, message) {

    $.ajax({
        url: rootVirtual + '/Admin/RegisterUser.aspx?action=Register',
        dataType: 'json',
        data: {
            userData: JSON.stringify(data),
            inviteType: send,
            msgContent: message
        },
        success: function (data, textStatus, jqXHR) {
            log(data.message);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //log(data.message);
        }
    })
}
var log = function (msg) {
    var logVal = $("#log").val();
    logVal = logVal ? (logVal + '\n') : logVal
    $("#log").val(logVal + msg);
}