$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';

	brh.getKols(function(result) {
			var arrText = doT.template($("#kol_temp").text());
			var innerHTML = arrText(result.data);
			$("#kol_list").html(innerHTML);
			// 智库 了解详情
			$('.zhiku__item').each(function(index, item) {
				var $item = $(item)
				var $viewBtn = $item.find('.zhiku-btn__more')
				var $dialog = $item.find('.zhiku_dialog')
				var $close = $dialog.find('.close')
				var $mask = $item.find('.weui-mask')
				var $contactBtn = $dialog.find('.btn-contact')
				$viewBtn.click(function() {
					$dialog.addClass('show')
				})
				$contactBtn.click(function(e) {
					e.stopPropagation();
					message.confirm("确认预约", "预约咨询服务将扣除服务券一张！", null, function(r) {
						if(r) {
							brh.applyService(services.qiyezixun, appType.zhiku, $(this).data("kolid"),
								function(result) {
									$dialog.removeClass('show');
									message.toast("预约成功", 'error');
								},
								function(err) {
//									$dialog.removeClass('show');
									message.toast(err.message, 'error');
								});
						}
					});
				});
				//				$close.add($mask).add($contactBtn).click(function() {
				//					$dialog.removeClass('show');
				//				});
				$close.click(function() {
					$dialog.removeClass('show');
				});

			});

		},
		function(err) {
			message.toast("获取数据失败", 'error');
		});

	// 媒体库 tab切换
	var $tabs = $('.media-container .weui-navbar__item')
	var $tab_panels = $('.media-container .media-tab__panel')
	$tabs.click(function() {
		var index = $(this).index()
		if($(this).hasClass('weui-bar__item_on')) {
			return false
		} else {
			$tab_panels.eq(index).addClass('show').siblings().removeClass('show')
			$(this).addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on')
		}
	});
})