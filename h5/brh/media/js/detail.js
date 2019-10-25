$(function() {
	document.querySelector('html').style.fontSize = (window.innerWidth / 320 * 12) + 'px';
	var xAxisData = [],
		readTotal = [],
		ttTotal = [],
		avgTotal = [],
		likeTotal = [];
	var mediano = $.getUrlParam("mediano");
	var level = Number($.getUrlParam("level"));
	var mediaid;
	brh.getMediaDetail(mediano, null, null, function(result) {
		var data = result.data;
		mediaid = data.media_id;
		data.labels = data.media_label ? data.media_label.split(',') : [];
		var mediaTemp = doT.template($("#media_temp").text());
		$("body").append(mediaTemp(data));
		for(var i = 0; i < data.ranks.length; i++) {
			var item = data.ranks[i];
			xAxisData.push(item.date);
			readTotal.push(item.readnum_all);
			ttTotal.push(item.url_times_readnum);
			avgTotal.push(item.readnum_av);
			likeTotal.push(item.likenum_all);
		}
		// 数据趋势图 tab切换
		var $tabs1 = $('.chart-data .weui-navbar__item')
		var $tab_panels1 = $('.chart-data .weui-tab__panel_container')
		$tabs1.click(function() {
			var index = $(this).index()
			if($(this).hasClass('weui-bar__item_on')) {
				return false
			} else {
				$tab_panels1.eq(index).addClass('show').siblings().removeClass('show')
				$(this).addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on')
			}
		});
		renderChar('总阅读数量', readTotal, "allChart");
		renderChar('头条阅读数', ttTotal, "ttChart");
		renderChar('平均阅读数', avgTotal, "pjChart");
		renderChar('点赞数', likeTotal, "dzChart");
		$(".weui-tab__panel_container").each(function(index, ele) {
			if(index > 0) $(this).removeClass("show");
		});

		$("#btnYY").click(function function_name(e) {
			message.confirm("确认预约", "预约媒体服务将扣除媒体服务券一张！", null, function(r) {
				if(r) {
					brh.applyService(level == 0 ? services.yanxuanmeiti : services.youxuanmeiti, appType.guanggao, mediaid,
						function(result) {
							message.toast("预约成功", 'error');
						},
						function(err) {
							message.toast(err.message, 'error');
						});
				}
			});
		})
	}, function(err) {

	});

	function renderChar(cate, data, eleid) {
		option = {
			title: {
				text: ''
			},
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				top: "5%",
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xAxisData
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				name: cate,
				type: 'line',
				stack: '总量',
				itemStyle: {
					normal: {
						color: '#339fe7',
						lineStyle: {
							color: '#339fe7'
						}
					}
				},
				data: data
			}]
		};
		echarts.init(document.getElementById(eleid)).setOption(option);
	}

});