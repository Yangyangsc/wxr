var messageType = {
	success: 'success',
	warning: 'warning',
	error: 'error'
};

var message = {
	toastTemplete: '<div id="toast" class="wx-toast__container" style="z-index:9999;font-size:1.2rem">' +
		'<div class="weui-mask_transparent"></div>' +
		'<div class="weui-toast">' +
		'<i class="{{=it.class}} weui-icon_toast"></i>' +
		'<p class="weui-toast__content">{{=it.msg}}</p>' +
		'</div>' +
		'</div>',
	toast: function(msg, type, callback) {
		callback = callback || function() {};
		var classEnum = {
			warning: 'message-warning',
			error: 'message-error'
		}
		if(!classEnum.hasOwnProperty(type)) {
			weui.toast(msg);
			return;
		}
		var data = {
			msg: msg,
			class: classEnum.hasOwnProperty(type) ? classEnum[type] : ""
		}
		var html = doT.template(message.toastTemplete)(data);
		var showToast = function() {
			$(document.body).append(html);
			var t = setTimeout(function() {
				$("#toast").remove();
				clearTimeout(t)
			}, 1000 * 3)
		}
		if($(".wx-toast__container").length > 0) {
			$(".wx-toast__container").remove();
			showToast()
		} else {
			showToast();
		}
	},
	confirm: function(title, content, btn, callback) {
		var data = {
			title: title || "",
			content: content || "",
			btn: btn || ['取消', '确认']
		};
		callback = callback || function() {};
		var confirmHtml = '<div class="js_dialog" id=dialog style="opacity: 1;">' +
			'<div class="weui-mask" style="z-index:9998;"></div>' +
			'<div class="weui-dialog" style="z-index:9999;">' +
			'  <div class="weui-dialog__hd">' +
			'    <strong class="weui-dialog__title">{{=it.title}}</strong>' +
			'  </div>' +
			'  <div class="weui-dialog__bd">{{=it.content}}</div>' +
			'  {{? it.btn.length==2}}' +
			'  	 <div class="weui-dialog__ft">' +
			'    	<a href="javascript:;" data-value="0" class="weui-dialog__btn weui-dialog__btn_default">{{=it.btn[0]}}</a>' +
			'    	<a href="javascript:;" data-value="1" class="weui-dialog__btn weui-dialog__btn_primary">{{=it.btn[1]}}</a>' +
			'  	 </div>' +
			'  {{??}}' +
			'    <div class="weui-dialog__ft">' +
			'    	<a href="javascript:;" data-value="1" class="weui-dialog__btn weui-dialog__btn_primary">{{=it.btn[0]}}</a>' +
			'    </div>' +
			'  {{?}}' +
			'</div>' +
			'</div>';
		$(document.body).append(doT.template(confirmHtml)(data));
		$('#dialog').unbind("click").on('click', '.weui-dialog__btn', function() {
			callback(Number(this.dataset.value));
			$('#dialog').remove();
		});
	}
}