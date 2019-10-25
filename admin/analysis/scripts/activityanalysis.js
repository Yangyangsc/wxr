$(function() {    
	startAnalysis();
});
function startAnalysis() {
	ApiCaller.Get({
		url: "/analysis/activity",
		successFunc: function(result) {
			var data;
			$("#TotalActivity").text(result.activityCount);
			$("#TotalActive").text(result.activeCount);
			///人气最旺活动
			result.hotActivity.chartContainer='hotActivity';
			charts.renderMutilBarChart(result.hotActivity);
			///收益最佳活动
			result.bestIncome.chartContainer = 'hotIncome';
			charts.renderBarChart(result.bestIncome)
			///每佳推广渠道
			result.bestChannel.chartContainer = 'bestChannel';
			charts.renderMutilBarChart(result.bestChannel);
			///最佳销售渠道
			result.bestChannelIncome.chartContainer = 'channelIncome';
			charts.renderBarChart(result.bestChannelIncome);
		}
	});
};
