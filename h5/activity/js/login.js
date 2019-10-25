var tmpDic, postData

$(document).ready(function () {

    $("#tel").val("13000000000")
    $("#code").val("8888")

    $("#login_button").on("click", function (e) {
        e.preventDefault();
        var input_tel = $("#tel").val().trim()
        var input_code=$("#code").val().trim()
        console.log(input_code)
        if (!input_tel) {
            $("#tips_tel").css("display", "block")
            $("#tips_tel").text("手机号码不能为空")
            return false
        } else if (!/^1[345678]\d{9}$/.test(input_tel)) {
            $("#tips_tel").css("display", "block")
            $("#tips_tel").text("请输入正确的手机号码")
            return false
        }else if(!input_code){
            $("#tips_code").css("display", "block")
            $("#tips_code").text("验证码不能为空")
        } else {
            $("#tips_tel").css("display", "none")
            var postData = $("#login_form").serialize()
            var tmpDic = {}
            for (var i in postData.split("&")) {
                var row = postData.split("&")[i];
                tmpDic[row.split("=")[0]] = decodeURIComponent(row.split("=")[1]);
            }
            submit(tmpDic)
            return true
        }
    })

    $("#tel").blur(function () {
        var input_tel = $(this).val().trim()
        if (!input_tel) {
            $("#tips_tel").css("display", "block")
            $("#tips_tel").text("手机号码不能为空")
            return false
        } else if (!/^1[345678]\d{9}$/.test(input_tel)) {
            $("#tips_tel").css("display", "block")
            $("#tips_tel").text("请输入正确的手机号码")
            return false
        } else {
            $("#tips_tel").css("display", "none")
            return true
        }
    });

    function submit(tmpDic) {
        activity.login({
            user_mobile: tmpDic.user_mobile,
            code: tmpDic.code
        }, function (res) {
            console.log("res")
            console.log(res)
            localStorage.setItem("login_data", res.user_id)
            console.log(history.go())
            history.go(-1) ? history.go(-1) : window.location.href = "/index.html"
        }, function (err) {
            console.log("err")
            $("#tips_code").css("display","block")
            $("#tips_code").text(err.message)
            console.log(err)
        })
    }

});