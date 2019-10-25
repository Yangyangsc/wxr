function GetVerifyCode() {
    ApiCaller.Get({
        waitingMask: false, withToken: false,
        url: '/serial',
        successFunc: function (result) {
            if (!document.getElementById("divcode")) {
                var divElement = document.createElement("div");
                divElement.id = "divcode";
                divElement.className = "verifyDiv";
                divElement.style.display = "none";
                document.body.appendChild(divElement);
            }
            if (!document.getElementById("verifykey")) {
                var verifyKey = document.createElement("input");
                verifyKey.type = "hidden";
                verifyKey.id = "verifykey";
                verifyKey.name = "verifykey";
                verifyKey.value = "";
                document.getElementsByName('body').appendChild(verifyKey);
            }
            document.getElementById("verifykey").value = result.key;
            document.getElementById("divcode").innerHTML = result.code;
            var svgXml = result.code;

            var image = new Image();
            image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流

            var canvas = document.createElement('canvas');  //准备空画布
            canvas.width = document.getElementById("divcode").children[0].width.animVal.value;
            canvas.height = document.getElementById("divcode").children[0].height.animVal.value;

            var context = canvas.getContext('2d');  //取得画布的2d绘图上下文
            context.drawImage(image, 0, 0);

            var vimg = document.getElementById('imgSerial');
            vimg.src = canvas.toDataURL('image/png');  //将画布内的信息导出为png图片数据

        },
        failFunc: function (result) {
            alert("获取验证码图片失败");
        }
    });
};
GetVerifyCode();

