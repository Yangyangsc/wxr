$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';
	var mediaTemp = doT.template($("#media_temp").text());

	var itemIndex = 0;
	var tab1LoadEnd = false;
	var tab2LoadEnd = false;

	// 媒体库 tab切换
	$('.weui-navbar__item').on('click', function() {
		var $this = $(this);
		itemIndex = $this.index();
		if($this.hasClass('weui-bar__item_on')) {
			return false
		} else {
			$('.media-container .media-tab__panel').eq(itemIndex).addClass('show').siblings().removeClass('show')
			$this.addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on')
		}
		// 如果选中菜单一
		if(itemIndex == '0') {
			// 如果数据没有加载完
			if(!tab1LoadEnd) {
				// 解锁
				dropload.unlock();
				dropload.noData(false);
			} else {
				// 锁定
				dropload.lock('down');
				dropload.noData();
			}
			// 如果选中菜单二
		} else if(itemIndex == '1') {
			if(!tab2LoadEnd) {
				// 解锁
				dropload.unlock();
				dropload.noData(false);
			} else {
				// 锁定
				dropload.lock('down');
				dropload.noData();
			}
		}
		// 重置
		dropload.resetload();
	});

	var rows = 10;
	var youxuanpage = 1,
		yanxuanpage = 1;
	var itemIndex = 0;
	var tab1LoadEnd = false;
	var tab2LoadEnd = false;

	var dropload = $('.weui-tab__panel').dropload({
		domDown: { 
			domNoData: '<div class="dropload-noData" style="color:gray;">无更多数据</div>'
		},
		scrollArea: window,
		//		loadUpFn: function(me) {
		//			// 加载菜单一的数据
		//			if(itemIndex == '0') {
		//				tab1LoadEnd = false;
		//				youxuanpage = 1;
		//				brh.getMedias(1, youxuanpage, rows, function(result) {
		//					renderMedia(me, 'youxuanList', result.data);
		//					youxuanpage++;
		//					me.resetload();
		//				}, function(err) {
		//					me.resetload();
		//				})
		//				// 加载菜单二的数据
		//			} else if(itemIndex == '1') {
		//				tab2LoadEnd = false;
		//				yanxuanpage = 1;
		//				brh.getMedias(0, yanxuanpage, rows, function(result) {
		//					renderMedia(me, 'yanxuanList', result.data);
		//					yanxuanpage++;
		//					me.resetload();
		//				}, function(err) {
		//					me.resetload();
		//				})
		//			}
		//		},
		loadDownFn: function(me) {
			// 加载菜单一的数据
			if(itemIndex == '0') {
				brh.getMedias(1, youxuanpage, rows, function(result) {
					renderMedia(me, 'youxuanList', result.data);
					youxuanpage++;
					me.resetload();
				}, function(err) {
					me.resetload();
				})
				// 加载菜单二的数据
			} else if(itemIndex == '1') {
				brh.getMedias(0, yanxuanpage, rows, function(result) {
					renderMedia(me, 'yanxuanList', result.data);
					yanxuanpage++;
					me.resetload();
				}, function(err) {
					me.resetload();
				})
			}
		}
	});

	var renderMedia = function(curdrop, container, data) {
		if(data.length < rows) {
			curdrop.lock(); // 锁定
			curdrop.noData(); // 无数据
			if(itemIndex == 0) tab1LoadEnd = true;
			else tab2LoadEnd = true;
		}
		if(youxuanpage == 1) $("#youxuanList").html('');
		if(yanxuanpage == 1) $("#yanxuanList").html('');
		for(var i = 0; i < data.length; i++) {
			data[i].labels = data[i].media_label ? data[i].media_label.split(',') : [];
		}
		var innerHTML = mediaTemp(data);
		$("#" + container).append(innerHTML);
	};
})