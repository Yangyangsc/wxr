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
			$this.addClass('show').siblings().removeClass('show')
			$(this).addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on')
		}
		// 重置
		dropload.resetload();
	});

	var rows = 10;
	var youxuanpage = 1,
		yanxuanpage = 1;
	// dropload
	var yoxdropload = $('#div_youxuan').dropload({
		scrollArea: window,
		loadUpFn: function(me) {
			youxuanpage = 1;
			brh.getMedias(1, youxuanpage, rows, function(result) {
				renderMedia(me, 'youxuanList', result.data);
				youxuanpage++;
				me.resetload();
			}, function(err) {
				me.resetload();
			})
		},
		loadDownFn: function(me) {
			brh.getMedias(1, youxuanpage, rows, function(result) {
				renderMedia(me, 'youxuanList', result.data);
				youxuanpage++;
				me.resetload();
			}, function(err) {
				me.resetload();
			})
		}
	});

	var yaxdropload = $('#div_yanxuan').dropload({
		scrollArea: window,
		loadUpFn: function(me) {
			yanxuanpage = 1;
			brh.getMedias(0, yanxuanpage, rows, function(result) {
				renderMedia(me, 'yanxuanList', result.data);
				yanxuanpage++;
				me.resetload();
			}, function(err) {
				me.resetload();
			})
		},
		loadDownFn: function(me) {
			brh.getMedias(0, yanxuanpage, rows, function(result) {
				renderMedia(me, 'yanxuanList', result.data);
				yanxuanpage++;
				me.resetload();
			}, function(err) {
				me.resetload();
			})
		}
	});

	var renderMedia = function(curdrop, container, data) {
		if(data.length < rows) {
			curdrop.lock(); // 锁定
			curdrop.noData(); // 无数据
		}
		for(var i = 0; i < data.length; i++) {
			data[i].labels = data[i].label ? data[i].label.split(',') : [];
		}
		var innerHTML = mediaTemp(data);
		$("#" + container).append(innerHTML);
	};
})