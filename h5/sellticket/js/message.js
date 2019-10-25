var messageType = {
    success: 'success',
    warning: 'warning',
    error: 'error'
};

var message = {
    toastTemplete: `
        <div id="toast" class="wx-toast__container" style="z-index:9999;">
            <div class="weui-mask_transparent"></div>
            <div class="weui-toast">
            <i class="{{=it.class}} weui-icon_toast"></i>
            <p class="weui-toast__content">{{=it.msg}}</p>
            </div>
        </div>`,
    toast: function (msg, type, callback) {
        callback = callback || function () { };
        var classEnum = {
            warning: 'message-warning',
            error: 'message-error'
        }
        if (!classEnum.hasOwnProperty(type)) {
            weui.toast(msg);
            return;
        }
        var data = {
            msg: msg,
            class: classEnum.hasOwnProperty(type) ? classEnum[type] : ""
        }
        var html = doT.template(message.toastTemplete)(data);
        var showToast = function () {
            $(document.body).append(html);
            var t = setTimeout(function () {
                $("#toast").remove();
                clearTimeout(t)
            }, 1000 * 3)
        }
        if ($(".wx-toast__container").length > 0) {
            $(".wx-toast__container").remove();
            showToast()
        }
        else {
            showToast();
        }
    }
}